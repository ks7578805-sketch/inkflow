import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenAI, Modality } from '@google/genai';
import OpenAI, { toFile } from 'openai';
import sharp = require('sharp');
import type {
  CreateStencilGenerationRequest,
  StencilPrecheckAnalysis,
  StencilStylePreset,
  StencilVariantKind,
  StencilProvider,
} from '@inkflow/contracts';

// Local 1:1 map — the contracts package exports the same constant, but
// importing a runtime value from `@inkflow/contracts` would force the
// compiled JS to resolve a TS source path at runtime. Duplicating it here
// keeps the API self-contained until contracts ships as compiled JS.
const STYLE_TO_VARIANT: Record<StencilStylePreset, StencilVariantKind> = {
  fineline: 'fineline',
  blackwork: 'blackwork',
  realismo: 'realismo',
};

type ProviderMode = 'real_api';

type StyleProfile = {
  backgroundLift: number;
  localContrast: number;
  lineThreshold: number;
  lineMorphology: number;
  lineSharpness: number;
  lineGamma: number;
  shadeStrength: number;
  shadeIntensity: number;
};

const GOOGLE_PROVIDER: StencilProvider = 'google';
const OPENAI_PROVIDER: StencilProvider = 'openai';
const ANALYSIS_MODEL = 'gemini-2.5-flash';
// Nano Banana 2 — Google's current best image generation/editing model.
const IMAGE_MODEL = 'gemini-3.1-flash-image';
// gpt-image-2 — OpenAI's current best image generation/editing model. Bumped
// from gpt-image-1 (older). gpt-4o is used for vision analysis because it
// gives stronger structured JSON than the smaller 4o-mini.
const OPENAI_ANALYSIS_MODEL = 'gpt-4o';
const OPENAI_IMAGE_MODEL = 'gpt-image-2';

const PROVIDER_MODELS: Record<StencilProvider, { analysis: string; image: string }> = {
  google: { analysis: ANALYSIS_MODEL, image: IMAGE_MODEL },
  openai: { analysis: OPENAI_ANALYSIS_MODEL, image: OPENAI_IMAGE_MODEL },
};

const VARIANT_LABELS: Record<StencilVariantKind, string> = {
  fineline: 'Fine Line',
  blackwork: 'Blackwork',
  realismo: 'Realismo',
  // Legacy labels — kept so old rows still render a friendly title.
  line_only: 'Fine Lines (legado)',
  light_shade: 'Soft Shade (legado)',
  heavy_shade: 'Rich Shade (legado)',
};

// Shared preamble — anchors the model to "transfer stencil" identity. Every
// REQUIRED / FORBIDDEN block downstream layers on top of this.
const STENCIL_PREAMBLE = `PRINT-READY TATTOO STENCIL on pure white paper. This is a thermal-copier transfer guide (Spirit / S8 / Reprofax) the tattoo artist will tape to skin and trace with a machine. It is NOT a finished tattoo, NOT a drawing of the subject, NOT painted art, NOT a sketch, NOT an engraving, NOT a cartoon vector, NOT illustration art. Subject ONLY: the entire background of the reference is removed and replaced by clean white paper — no scenery, no environmental shadow, no objects that won't be tattooed. Subject identity, anatomy, proportions and angle preserved EXACTLY as in the reference — no stylised "AI face", no invented details, no removed features. Lines are clean, continuous, decided pen strokes with fully closed contours — no jagged edges, no double lines, no ghost lines, no pixelation, no tremor. Aspect ratio matches the source orientation (portrait stays portrait, landscape stays landscape).`;

// Reusable structured prompt map. Each style declares what MUST appear
// (REQUIRED), what must NEVER appear (FORBIDDEN — the AI's default-mode
// failures), the high-level look, and a short reference formula that
// proved reliable in field tests. `tonalMode` decides whether the Sharp
// post-processing binarises the output (`binary`) or preserves the
// AI's grayscale gradient (`tonal`).
type StencilStylePromptSpec = {
  label: string;
  required: string[];
  forbidden: string[];
  outputFeel: string;
  referenceFormula: string;
  tonalMode: 'binary' | 'tonal';
};

const stencilStylePrompts: Record<StencilStylePreset, StencilStylePromptSpec> = {
  fineline: {
    label: 'Fine Line',
    required: [
      'Thin uniform line weight from start to end of EVERY stroke (like a 0.05–0.2mm technical pen). Weight does not vary.',
      'Single precise contour for each form — no double-tracing.',
      'Fully CLOSED contours — every contour returns to itself.',
      'Minimum shading. If volume must be hinted, use 2–4 SHORT delicate single lines (never grouped clusters).',
      'Generous white space — most of the canvas is empty paper, the drawing breathes.',
      'Confident decided strokes — no fade-outs at line ends, no tremor.',
    ],
    forbidden: [
      'NO cross-hatching. NO dense hatching. NO grouped parallel lines for shadow.',
      'NO stippling, NO clusters of dots.',
      'NO solid black fills, NO filled shapes inside contours.',
      'NO gradient fills, NO grayscale, NO gray pixels — output is pure black on pure white only.',
      'NO etching, NO engraving, NO xilogravura, NO printmaking texture.',
      'NO cartoon vector outlines, NO comic-book look.',
      'NO background of any kind — pure white only.',
    ],
    outputFeel:
      'Clean technical-pen contour stencil — maximum line economy, mostly empty paper.',
    referenceFormula:
      'clean fine line, thin uniform single lines, fully closed contours, pure black lines on white background, no grayscale, no gradients, no shading, highlighting only main structure',
    tonalMode: 'binary',
  },
  blackwork: {
    label: 'Blackwork',
    required: [
      'BOLD confident contour lines — clearly thicker than fine line. Outer contours heaviest, inner detail contours finer for depth.',
      'Shadow zones rendered as 100% SOLID BLACK FILLS — like cut-paper silhouettes. Each shadow zone is a contiguous block of pure black, internally TEXTURELESS.',
      'BINARY tone: every pixel is EITHER pure black OR pure white — never gray, never textured.',
      'Solid black coverage stays under ~40% of the canvas — white paper still dominates.',
      'Fully CLOSED contours around every shape.',
    ],
    forbidden: [
      'NO cross-hatching to FAKE black areas — SOLID FILL ONLY.',
      'NO parallel lines to FAKE shadow — SOLID FILL ONLY.',
      'NO stippling, NO dotted shading, NO halftones.',
      'NO grayscale, NO mid-tones, NO gradients.',
      'NO etching, NO engraving, NO xilogravura, NO printmaking texture.',
      'NO photographic shading inside the subject.',
      'NO cartoon vector outlines, NO comic-book inking style.',
      'NO background of any kind — pure white only.',
    ],
    outputFeel:
      'High-contrast paper cutout — solid black silhouettes and confident bold contours on pure white paper.',
    referenceFormula:
      'bold solid linework, solid black fill areas, high-contrast pure black and white, no grayscale, no hatching, no gradients, strong closed lines, clean tattoo draft',
    tonalMode: 'binary',
  },
  realismo: {
    label: 'Realismo',
    required: [
      'SMOOTH tonal gradient covering the FULL grayscale: pure white (highlights) → light gray → medium gray → dark gray → pure black (deepest shadows).',
      'Smooth transitions between zones — light areas fade gradually into darker areas, NEVER with hard edges.',
      'CLEARLY differentiated contrast zones: highlights unmistakably bright, deep shadows unmistakably dark. The tattoo artist must read the volumetric depth instantly.',
      'Subtle contour lines ONLY where definition is needed (eye rim, lip edge, nostril, fingernail, hair strand boundary). Most of the form is defined by tonal gradient alone, with NO outline.',
      'Maximum fidelity to the reference photo — skin texture, hair flow, eye reflections, fabric folds, expressions preserved as tonal patterns.',
      'Three clear tonal layers visible: light zones (white/light gray), mid-tones (medium gray), deep shadows (dark gray/black).',
    ],
    forbidden: [
      'NO UNIFORM STIPPLING covering the entire face at the same density — that flattens the image.',
      'NO uniform cross-hatching covering everything equally.',
      'NO flat texture without tonal variation.',
      'NO solid flat black fills outside the deepest shadow areas.',
      'NO chunky outlines around every shape — let tonal gradient carry the form.',
      'NO cartoon vector outlines, NO comic-book inking.',
      'NO photographic SKIN COLOUR — pure grayscale only.',
      'NO etching, NO engraving, NO xilogravura, NO printmaking texture.',
      'NO background of any kind — pure white paper only.',
    ],
    outputFeel:
      'High-end black-and-white pencil/charcoal preparatory study — smooth tonal MAP that reads as light/mid-tone/shadow at a glance.',
    referenceFormula:
      'smooth grayscale tonal stencil, soft gradient black-and-grey shading, clearly differentiated highlight-midtone-shadow zones, maximum subject fidelity, no uniform stippling, no flat texture, smooth pencil-like shading for tattoo transfer guide',
    tonalMode: 'tonal',
  },
};

// Tiny helper — picks a low/mid/high label from a 0-100 slider value.
function labelFromValue(value: number, lo: string, mid: string, hi: string) {
  if (value <= 32) return lo;
  if (value >= 72) return hi;
  return mid;
}

// Maps swatch hex codes to vivid human descriptions so the AI knows the
// stencil will end up tinted. Falls back to the raw hex for custom colours.
const LINE_COLOR_DESCRIPTIONS: Record<string, string> = {
  '#080808': 'jet black ink',
  '#000000': 'jet black ink',
  '#0a0a0a': 'jet black ink',
  '#e53935': 'vivid red transfer ink',
  '#dc2626': 'vivid red transfer ink',
  '#ef4444': 'vivid red transfer ink',
  '#3b82f6': 'vivid cobalt blue transfer ink',
  '#2563eb': 'vivid cobalt blue transfer ink',
  '#2196f3': 'vivid cobalt blue transfer ink',
  '#22c55e': 'vivid emerald green transfer ink',
  '#16a34a': 'vivid emerald green transfer ink',
  '#a855f7': 'vivid violet transfer ink',
  '#7c3aed': 'vivid violet transfer ink',
};

function describeLineColor(hex: string): string {
  return LINE_COLOR_DESCRIPTIONS[(hex || '').toLowerCase()] || `the colour ${hex}`;
}

// Numeric profiles fed to the Sharp post-processing pipeline. They turn the
// Gemini-generated draft into a printable stencil with the right visual weight.
const STYLE_PROFILES: Record<StencilStylePreset, StyleProfile> = {
  fineline: {
    backgroundLift: 22,
    localContrast: 2.1,
    lineThreshold: 108,
    // 0 = keep the AI's natural line weight. Previously -1 (erode) broke
    // the already-thin fineline strokes into dotted segments — the
    // reference shows clean continuous contours, not stippled lines.
    lineMorphology: 0,
    lineSharpness: 1.3,
    lineGamma: 1.35,
    shadeStrength: 0.0,
    shadeIntensity: 0.0,
  },
  blackwork: {
    backgroundLift: 10,
    localContrast: 2.6,
    // Lower threshold than realismo because blackwork's "shadow" is solid
    // black blocks from the AI — those are pure black already and easy to
    // capture, no need to catch mid-density hatching.
    lineThreshold: 112,
    lineMorphology: 1,
    lineSharpness: 1.6,
    lineGamma: 1.15,
    shadeStrength: 0.0,
    shadeIntensity: 0.0,
  },
  realismo: {
    backgroundLift: 14,
    localContrast: 2.4,
    // Higher threshold than blackwork/fineline because realismo now relies
    // ENTIRELY on the AI's hatching/stippling for shadow. The threshold
    // must catch mid-density hatching as black lines, not let it slip into
    // gray noise that gets thrown away.
    lineThreshold: 124,
    lineMorphology: 0,
    lineSharpness: 1.4,
    lineGamma: 1.22,
    shadeStrength: 0.0,
    shadeIntensity: 0.0,
  },
};

const OUTPUT_SIZES: Record<CreateStencilGenerationRequest['outputSize'], { width: number; height: number }> = {
  a4: { width: 2480, height: 3508 },
  a3: { width: 3508, height: 4961 },
  letter: { width: 2550, height: 3300 },
  custom: { width: 2480, height: 3508 },
};

type GeneratedVariant = {
  kind: StencilVariantKind;
  label: string;
  bytes: Buffer;
  mimeType: string;
  width: number;
  height: number;
  metadata: Record<string, unknown>;
};

@Injectable()
export class StencilAiService {
  private readonly googleApiKey = process.env.GOOGLE_API_KEY?.trim() ?? '';
  private readonly googleClient = this.googleApiKey ? new GoogleGenAI({ apiKey: this.googleApiKey }) : null;
  private readonly openaiApiKey = process.env.OPENAI_API_KEY?.trim() ?? '';
  private readonly openaiClient = this.openaiApiKey ? new OpenAI({ apiKey: this.openaiApiKey }) : null;

  getProviderMode(): ProviderMode {
    return 'real_api';
  }

  getProviderInfo() {
    return {
      provider: GOOGLE_PROVIDER,
      providerMode: this.getProviderMode(),
      analysisModel: ANALYSIS_MODEL,
      imageModel: IMAGE_MODEL,
    };
  }

  private resolveProvider(provider: StencilProvider | undefined): StencilProvider {
    return provider === 'openai' ? 'openai' : 'google';
  }

  async analyzeReferenceImage(
    source: Buffer,
    mimeType: string,
    provider: StencilProvider = 'google',
  ): Promise<StencilPrecheckAnalysis> {
    const resolved = this.resolveProvider(provider);
    if (resolved === 'openai') {
      return this.analyzeReferenceImageOpenAi(source, mimeType);
    }
    return this.analyzeReferenceImageGoogle(source, mimeType);
  }

  private async analyzeReferenceImageGoogle(source: Buffer, _mimeType: string): Promise<StencilPrecheckAnalysis> {
    this.assertGoogleConfigured();
    const inlineImage = await this.buildInlineImage(source);

    try {
      const response = await this.googleClient!.models.generateContent({
        model: ANALYSIS_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  'You are a professional tattoo artist reviewing a reference photo before turning it into a stencil. ' +
                  'Return strict JSON with these keys: subject, recommendedCrop, contrastAssessment, complexity, warnings, styleHints. ' +
                  '`warnings` must list any quality issues that hurt stencil generation (cluttered background, multiple subjects, low resolution, poor lighting, busy patterns, complex scene). ' +
                  '`recommendedCrop` should describe the tightest crop that isolates the tattooable subject. ' +
                  '`styleHints` should list 2-4 stylistic adjectives a tattooer would care about. ' +
                  'Keep each field concise.',
              },
              { inlineData: inlineImage },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          responseSchema: {
            type: 'object',
            properties: {
              subject: { type: 'string' },
              recommendedCrop: { type: 'string' },
              contrastAssessment: { type: 'string' },
              complexity: { type: 'string' },
              warnings: { type: 'array', items: { type: 'string' } },
              styleHints: { type: 'array', items: { type: 'string' } },
            },
            required: ['subject', 'recommendedCrop', 'contrastAssessment', 'complexity', 'warnings', 'styleHints'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}') as Partial<StencilPrecheckAnalysis>;
      return {
        subject: parsed.subject || 'Tattoo reference',
        recommendedCrop: parsed.recommendedCrop || 'Center the main subject',
        contrastAssessment: parsed.contrastAssessment || 'Moderate contrast',
        complexity: parsed.complexity || 'medium',
        warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
        styleHints: Array.isArray(parsed.styleHints) ? parsed.styleHints : [],
      };
    } catch (error) {
      console.error('Stencil precheck failed', error);
      throw new BadGatewayException('Google image analysis failed while preparing the stencil.');
    }
  }

  private async analyzeReferenceImageOpenAi(source: Buffer, _mimeType: string): Promise<StencilPrecheckAnalysis> {
    this.assertOpenAiConfigured();
    const flattened = await sharp(source).rotate().flatten({ background: '#ffffff' }).png().toBuffer();
    const dataUrl = `data:image/png;base64,${flattened.toString('base64')}`;

    try {
      const response = await this.openaiClient!.chat.completions.create({
        model: OPENAI_ANALYSIS_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a professional tattoo artist reviewing a reference photo before turning it into a stencil. ' +
              'Return strict JSON with these keys ONLY: subject, recommendedCrop, contrastAssessment, complexity, warnings, styleHints. ' +
              'warnings is a string[] listing quality issues that hurt stencil generation (cluttered background, multiple subjects, low resolution, poor lighting, busy patterns, complex scene). ' +
              'recommendedCrop describes the tightest crop that isolates the tattooable subject. ' +
              'styleHints is a string[] with 2-4 stylistic adjectives a tattooer would care about. ' +
              'Keep each field concise.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyse this tattoo reference and return the JSON described above.' },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
      });

      const content = response.choices?.[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(content) as Partial<StencilPrecheckAnalysis>;
      return {
        subject: parsed.subject || 'Tattoo reference',
        recommendedCrop: parsed.recommendedCrop || 'Center the main subject',
        contrastAssessment: parsed.contrastAssessment || 'Moderate contrast',
        complexity: parsed.complexity || 'medium',
        warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
        styleHints: Array.isArray(parsed.styleHints) ? parsed.styleHints : [],
      };
    } catch (error) {
      console.error('OpenAI precheck failed', error);
      throw new BadGatewayException('OpenAI image analysis failed while preparing the stencil.');
    }
  }

  // Phase A: always returns exactly ONE variant (the one mapped from the style).
  // The provider always lives in `controls.provider` (defaults to 'google' upstream).
  async generateVariants(
    source: Buffer,
    _mimeType: string,
    controls: CreateStencilGenerationRequest,
    analysis: StencilPrecheckAnalysis,
  ): Promise<GeneratedVariant[]> {
    const provider = this.resolveProvider(controls.provider);
    const { width: visualSourceWidth, height: visualSourceHeight } =
      await this.readVisualDimensions(source);
    const style = controls.selectedStyle;
    const variantKind = STYLE_TO_VARIANT[style];

    let imageBytes: Buffer;
    if (provider === 'openai') {
      this.assertOpenAiConfigured();
      imageBytes = await this.generateSingleVariantOpenAi(source, style, controls, analysis);
    } else {
      this.assertGoogleConfigured();
      const inlineImage = await this.buildInlineImage(source);
      imageBytes = await this.generateSingleVariantGoogle(inlineImage, style, controls, analysis);
    }

    const variant = await this.postProcessVariant(
      imageBytes,
      variantKind,
      style,
      controls,
      analysis,
      visualSourceWidth,
      visualSourceHeight,
      provider,
    );
    return [variant];
  }

  // Sharp's metadata() returns FILE dimensions even after .rotate() in the
  // chain — it reads from input, not post-pipeline. iPhone portrait shots
  // are typically stored as 1920x1080 with EXIF orientation=6 (rotate 90°),
  // so the file dims are landscape but the browser displays portrait. We
  // need the VISUAL dims (post-rotation) so the canvas aspect ratio in the
  // frontend matches both the user's photo and the rendered stencil.
  private async readVisualDimensions(source: Buffer): Promise<{ width: number | null; height: number | null }> {
    const meta = await sharp(source).metadata();
    if (!meta.width || !meta.height) {
      return { width: null, height: null };
    }
    // EXIF orientation 5–8 implies a 90° rotation → swap width/height.
    const isSwapped = typeof meta.orientation === 'number' && meta.orientation >= 5 && meta.orientation <= 8;
    return {
      width: isSwapped ? meta.height : meta.width,
      height: isSwapped ? meta.width : meta.height,
    };
  }

  private assertGoogleConfigured() {
    if (!this.googleClient || !this.googleApiKey) {
      throw new ServiceUnavailableException('Stencil generation is unavailable because GOOGLE_API_KEY is not configured on the server.');
    }
  }

  private assertOpenAiConfigured() {
    if (!this.openaiClient || !this.openaiApiKey) {
      throw new ServiceUnavailableException('Stencil generation is unavailable because OPENAI_API_KEY is not configured on the server.');
    }
  }

  private async buildInlineImage(source: Buffer) {
    const buffer = await sharp(source)
      .rotate()
      .flatten({ background: '#ffffff' })
      .png()
      .toBuffer();

    return {
      mimeType: 'image/png',
      data: buffer.toString('base64'),
    };
  }

  private async generateSingleVariantGoogle(
    inlineImage: { mimeType: string; data: string },
    style: StencilStylePreset,
    controls: CreateStencilGenerationRequest,
    analysis: StencilPrecheckAnalysis,
  ) {
    this.assertGoogleConfigured();
    const prompt = this.buildPrompt(style, controls, analysis);
    const requestConfig = { responseModalities: [Modality.IMAGE] };

    try {
      const response = await this.googleClient!.models.generateContent({
        model: IMAGE_MODEL,
        contents: [
          { inlineData: inlineImage },
          { text: prompt },
        ],
        config: requestConfig,
      });

      const imageBuffer = this.extractGeneratedImageBuffer(response);
      if (imageBuffer) return imageBuffer;
      throw new BadGatewayException('Google image generation returned no image data for the stencil.');
    } catch (contentError) {
      if (contentError instanceof BadGatewayException) throw contentError;
      console.error('Gemini image generateContent failed', { style, error: contentError });
      throw new BadGatewayException('Google image generation failed while creating the stencil.');
    }
  }

  private async generateSingleVariantOpenAi(
    source: Buffer,
    style: StencilStylePreset,
    controls: CreateStencilGenerationRequest,
    analysis: StencilPrecheckAnalysis,
  ) {
    this.assertOpenAiConfigured();
    const prompt = this.buildPrompt(style, controls, analysis);

    // gpt-image-2 edit endpoint needs a File-like input. Sharp normalises the
    // reference to PNG on white before we hand it to the model.
    const prepared = await sharp(source).rotate().flatten({ background: '#ffffff' }).png().toBuffer();
    const file = await toFile(prepared, 'reference.png', { type: 'image/png' });

    // Pick the closest supported aspect ratio from the source. With
    // `size: 'auto'` gpt-image-2 was returning 1024x1024 even for portrait
    // inputs, which forced a white-letterbox in post-processing whenever the
    // user had a portrait photo. Explicit size makes the AI output match the
    // source orientation so the before/after slider aligns 1:1. Uses visual
    // dimensions so EXIF-rotated phone photos get the right orientation.
    const { width: vW, height: vH } = await this.readVisualDimensions(source);
    const sourceAspect = vW && vH ? vW / vH : 1;
    const size: '1024x1024' | '1024x1536' | '1536x1024' =
      sourceAspect < 0.85 ? '1024x1536'
        : sourceAspect > 1.15 ? '1536x1024'
        : '1024x1024';

    try {
      // Quality stays at 'medium' so a generation completes in roughly
      // 12-20s. 'high' pushes it to 60s+ and multiplies token cost ~4x
      // without a meaningful quality jump for B&W stencil work.
      const response = await this.openaiClient!.images.edit({
        model: OPENAI_IMAGE_MODEL,
        image: file,
        prompt,
        size,
        quality: 'medium',
        n: 1,
      });

      const b64 = response.data?.[0]?.b64_json;
      if (!b64) {
        throw new BadGatewayException('OpenAI image generation returned no image data for the stencil.');
      }
      return Buffer.from(b64, 'base64');
    } catch (contentError) {
      if (contentError instanceof BadGatewayException) throw contentError;
      console.error('OpenAI image edit failed', { style, error: contentError });
      throw new BadGatewayException('OpenAI image generation failed while creating the stencil.');
    }
  }

  private buildPrompt(
    style: StencilStylePreset,
    controls: CreateStencilGenerationRequest,
    analysis: StencilPrecheckAnalysis,
  ) {
    const spec = stencilStylePrompts[style];

    // Slider knobs — derived from the hybrid "Intensidade" control on the
    // UI. Backend treats them as optional with sensible defaults so the
    // contract stays backwards-compatible.
    const thickness = controls.lineThickness;
    const detail =
      controls.detail !== undefined ? controls.detail : 100 - controls.simplify;
    const contrast = controls.contrast ?? 50;
    const brightness = controls.brightness ?? 50;

    const colorName = describeLineColor(controls.lineColor);

    const hintText = analysis.styleHints.length
      ? analysis.styleHints.join(', ')
      : 'Keep the composition readable and balanced.';
    const warningText = analysis.warnings.length
      ? analysis.warnings.join(', ')
      : 'Avoid clutter and incidental artifacts.';

    return [
      STENCIL_PREAMBLE,
      '',
      `STYLE — ${spec.label.toUpperCase()} STENCIL.`,
      '',
      'REQUIRED:',
      ...spec.required.map((r) => `- ${r}`),
      '',
      'FORBIDDEN — the AI defaults to these failures, REFUSE them:',
      ...spec.forbidden.map((f) => `- ${f}`),
      '',
      `OUTPUT FEEL: ${spec.outputFeel}`,
      `REFERENCE FORMULA: ${spec.referenceFormula}`,
      '',
      'USER ADJUSTMENTS — apply to this output:',
      `- Line thickness: ${labelFromValue(thickness, 'extra-thin', 'medium', 'bolder')} (${thickness}/100).`,
      `- Detail level: ${labelFromValue(detail, 'simplified — keep only essential structure', 'standard', 'maximum detail — preserve every recognisable feature')} (${detail}/100).`,
      `- Contrast: ${labelFromValue(contrast, 'softer transitions', 'balanced', 'pushed contrast — deepen darks and brighten lights')} (${contrast}/100).`,
      `- Brightness: ${labelFromValue(brightness, 'darker overall', 'balanced', 'brighter overall')} (${brightness}/100).`,
      '',
      `SUBJECT context (from pre-analysis): ${analysis.subject}. Crop guidance: ${analysis.recommendedCrop}. Contrast read: ${analysis.contrastAssessment}. Style hints: ${hintText}. Issues to mitigate: ${warningText}.`,
      '',
      `LINE COLOR — POST-TINT NOTE: the model output should use PURE BLACK INK (and middle grays only if the style explicitly allows tonal shading). Post-processing tints the final lines to ${colorName} so the artist sees them clearly. To make sure the tint reads cleanly, your strokes MUST be crisp and solid — never anti-aliased into wishy-washy gray edges.`,
      '',
      'Return image only — no captions, no logos, no signatures, no watermarks.',
    ].join('\n');
  }

  private async postProcessVariant(
    sourceBuffer: Buffer,
    kind: StencilVariantKind,
    style: StencilStylePreset,
    controls: CreateStencilGenerationRequest,
    analysis: StencilPrecheckAnalysis,
    sourceWidth: number | null,
    sourceHeight: number | null,
    provider: StencilProvider,
  ): Promise<GeneratedVariant> {
    const target = OUTPUT_SIZES[controls.outputSize];
    const profile = STYLE_PROFILES[style];

    // Render the stencil at the SOURCE image's aspect ratio so the in-app
    // comparison overlays line up 1:1 with the original. `target` (A4/A3/etc.)
    // becomes a maximum bounding box, not a forced shape — print/PDF export
    // adds A4 padding separately downstream.
    const { width: outWidth, height: outHeight } = this.computeRenderSize(
      sourceWidth,
      sourceHeight,
      target.width,
      target.height,
    );

    // Center-crop the AI output to the source aspect ratio BEFORE the resize.
    // OpenAI gpt-image-2 only supports 3 sizes (1024², 1024×1536, 1536×1024)
    // and Gemini returns whatever it generates — neither matches arbitrary
    // source aspects exactly. Without this crop, fit: 'contain' would add
    // white bars to the stencil that the original photo never has, breaking
    // the before/after alignment in the comparison slider.
    const aiMeta = await sharp(sourceBuffer).rotate().metadata();
    const aiW = aiMeta.width ?? 1024;
    const aiH = aiMeta.height ?? 1024;
    const targetAspect = outWidth / outHeight;
    const aiAspect = aiW / aiH;
    let cropW = aiW;
    let cropH = aiH;
    if (aiAspect > targetAspect) {
      // AI output wider than target → crop sides
      cropW = Math.max(1, Math.round(aiH * targetAspect));
    } else if (aiAspect < targetAspect) {
      // AI output taller than target → crop top/bottom
      cropH = Math.max(1, Math.round(aiW / targetAspect));
    }
    const cropLeft = Math.max(0, Math.round((aiW - cropW) / 2));
    const cropTop = Math.max(0, Math.round((aiH - cropH) / 2));

    // Pull derived slider values up so they affect both the AI prompt
    // (already injected upstream) AND these numeric post-processing steps.
    const detail =
      controls.detail !== undefined ? controls.detail : 100 - controls.simplify;
    const contrast = controls.contrast ?? 50;
    const brightness = controls.brightness ?? 50;

    // Contrast knob multiplies the CLAHE slope and brightness shifts the
    // linear offset. Both are clamped so extreme slider values never blow
    // out the image into solid black or white.
    const claheSlope = this.clamp(
      Math.round(profile.localContrast * 10 + (contrast - 50) * 0.18),
      8,
      48,
    );
    const linearOffset = this.clamp(
      profile.backgroundLift - 6 + Math.round((brightness - 50) * 0.5),
      -20,
      30,
    );

    const prepared = await sharp(sourceBuffer)
      .rotate()
      .flatten({ background: '#ffffff' })
      .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
      .resize(outWidth, outHeight, { fit: 'fill' })
      .grayscale()
      .normalise()
      .clahe({ width: 8, height: 8, maxSlope: claheSlope })
      .linear(1.02, linearOffset)
      .median(detail < 40 ? 2 : 1)
      .png()
      .toBuffer();

    const spec = stencilStylePrompts[style];

    // Threshold drops when detail is high (so finer hatching makes the cut)
    // and rises a touch when lines should be bolder.
    const lineThreshold = this.clamp(
      profile.lineThreshold
        + Math.round((50 - detail) * 0.15)
        + Math.round((controls.lineThickness - 50) * 0.05),
      88,
      150,
    );

    const lineMorphology = profile.lineMorphology
      + (controls.lineThickness >= 72 ? 1 : controls.lineThickness <= 32 ? -1 : 0);

    // Build the line/tone layer. Binary mode threshold-binarises (fineline,
    // blackwork) — tonal mode skips threshold so the AI's grayscale gradient
    // is preserved (realismo).
    const lineMaskBlackOnWhite = await this.buildLineLayer(
      prepared,
      lineThreshold,
      profile,
      lineMorphology,
      spec.tonalMode,
      style,
    );

    const composites: Array<{ input: Buffer; blend?: 'multiply' | 'over'; opacity?: number }> = [];

    // INTENTIONAL: no shade composites in any style. A real tattoo stencil
    // has zero gray pixels — every apparent tone comes from the AI's own
    // hatching/stippling density, which the line-threshold step captures as
    // pure black strokes. Previous multiply layers were depositing
    // photographic gray onto the canvas, making realismo look like a
    // smudged drawing instead of a transfer guide.

    // Tint the line mask to the user's chosen lineColor and add it on top.
    // The tinted layer is RGBA with alpha=255 on lines / alpha=0 on background,
    // so we use `over` (alpha blend) to paint the lines without recolouring the
    // white canvas underneath.
    const tintedLines = await this.tintLineLayer(lineMaskBlackOnWhite, controls.lineColor);

    // Outline-only mode skips the shade composites and the white canvas, so
    // the final PNG carries the tinted lines on a transparent background —
    // ready to drop into Procreate/Photoshop as a transfer overlay.
    let final: Buffer;
    if (controls.transparentBackground) {
      final = await sharp(tintedLines).png().toBuffer();
    } else {
      composites.push({ input: tintedLines, blend: 'over' });
      final = await sharp({
        create: {
          width: outWidth,
          height: outHeight,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .composite(composites)
        .png()
        .toBuffer();
    }

    const meta = await sharp(final).metadata();

    return {
      kind,
      label: VARIANT_LABELS[kind],
      bytes: final,
      mimeType: 'image/png',
      width: meta.width ?? outWidth,
      height: meta.height ?? outHeight,
      metadata: {
        preset: style,
        subject: analysis.subject,
        variant: kind,
        simplify: controls.simplify,
        lineColor: controls.lineColor,
        complexity: analysis.complexity,
        layerCount: controls.layerCount,
        outputSize: controls.outputSize,
        generatedAt: new Date().toISOString(),
        sourceWidth,
        sourceHeight,
        lineThickness: controls.lineThickness,
        provider,
        model: PROVIDER_MODELS[provider].image,
        providerMode: this.getProviderMode(),
        transparentBackground: Boolean(controls.transparentBackground),
      },
    };
  }

  private async buildLineLayer(
    prepared: Buffer,
    threshold: number,
    profile: StyleProfile,
    morphology: number,
    tonalMode: 'binary' | 'tonal',
    style?: StencilStylePreset,
  ) {
    let pipeline = sharp(prepared)
      .gamma(profile.lineGamma)
      .linear(1.0, -8)
      .sharpen(profile.lineSharpness + 0.25, 1.0, 2);

    if (tonalMode === 'tonal') {
      // Realismo path: keep the AI's smooth gray gradient AND amplify it.
      // Median denoise removes the "uniform noise / flat gray" the AI tends
      // to produce, then a steep linear curve (sigmoid-ish around 128)
      // separates highlights from shadows so the artist sees clear depth
      // zones instead of a soft uniform wash.
      pipeline = pipeline
        .median(3)
        .linear(1.6, -77);
      return pipeline.png().toBuffer();
    }

    // Binary path. Threshold to pure 0/255 so the stencil has no
    // anti-aliased edges to wash out the colour tint downstream.
    pipeline = pipeline.threshold(threshold);

    // Blackwork-specific: morphological CLOSING after threshold. Median
    // first to scrub away tiny pepper-noise dots the AI leaves between
    // hatch strokes; then erode→dilate fills small white gaps inside
    // dark regions, converting parallel-line hatching into solid black
    // masses (which is the whole point of blackwork).
    if (style === 'blackwork') {
      pipeline = pipeline
        .median(3)
        .erode(2)
        .dilate(2);
    }

    if (morphology < 0) pipeline = pipeline.erode(Math.abs(morphology));
    if (morphology > 0) pipeline = pipeline.dilate(morphology);

    return pipeline.png().toBuffer();
  }

  // Recolors a black-on-white line mask so the final ink uses the user's hex.
  // Background stays pure white; only the dark line pixels take the target color.
  // Strategy: turn the inverted (line-on-black) mask into an alpha channel, fill
  // the RGB plane with the target color, then return RGBA. The downstream
  // compositor lays it over the white canvas with `over` blend, so untouched
  // pixels show the white background through alpha=0.
  private async tintLineLayer(blackOnWhite: Buffer, hex: string) {
    const rgb = this.parseHex(hex);
    const meta = await sharp(blackOnWhite).metadata();
    const width = meta.width ?? 1;
    const height = meta.height ?? 1;

    // Thin coloured lines (blue, red, green, violet) look near-black to the
    // human eye even when the pixel colour is vivid — there isn't enough
    // colour area for the brain to register the hue. We solve this by
    // dilating coloured masks 1px so the line has enough body to read as
    // its true colour. Pure-black ink keeps the AI's natural line weight
    // because contrast against white paper is already maximum.
    const isPureBlack = rgb.r < 20 && rgb.g < 20 && rgb.b < 20;
    let maskForAlpha: Buffer = blackOnWhite;
    if (!isPureBlack) {
      maskForAlpha = await sharp(blackOnWhite).dilate(1).png().toBuffer();
    }

    // Alpha = 255 where the line was (black input), 0 where bg was (white input).
    const alpha = await sharp(maskForAlpha)
      .removeAlpha()
      .greyscale()
      .negate()
      .toBuffer();

    const colorFill = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: rgb.r, g: rgb.g, b: rgb.b },
      },
    })
      .png()
      .toBuffer();

    return sharp(colorFill)
      .joinChannel(alpha)
      .png()
      .toBuffer();
  }

  private parseHex(hex: string): { r: number; g: number; b: number } {
    const clean = (hex || '').replace('#', '').trim();
    if (clean.length !== 6) return { r: 8, g: 8, b: 8 };
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return { r: 8, g: 8, b: 8 };
    return { r, g, b };
  }

  private buildShadeLayer(prepared: Buffer, config: { blur: number; gamma: number; gain: number; offset: number; opacity: number }) {
    return sharp(prepared)
      .blur(config.blur)
      .gamma(config.gamma)
      .linear(config.gain, config.offset)
      .ensureAlpha(config.opacity)
      .png()
      .toBuffer();
  }

  private extractGeneratedImageBuffer(response: any) {
    if (typeof response.data === 'string' && response.data.length > 0) {
      return Buffer.from(response.data, 'base64');
    }

    for (const candidate of response.candidates ?? []) {
      for (const part of candidate.content?.parts ?? []) {
        if (typeof part.inlineData?.data === 'string' && part.inlineData.data.length > 0) {
          return Buffer.from(part.inlineData.data, 'base64');
        }
      }
    }

    return null;
  }

  private clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  // Fit a source w/h into a target bounding box while preserving aspect ratio.
  // Used so the in-app overlay stays 1:1 with the user's reference and the
  // before/after slider lines up perfectly.
  private computeRenderSize(
    sourceWidth: number | null,
    sourceHeight: number | null,
    maxWidth: number,
    maxHeight: number,
  ): { width: number; height: number } {
    if (!sourceWidth || !sourceHeight || sourceWidth <= 0 || sourceHeight <= 0) {
      return { width: maxWidth, height: maxHeight };
    }
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
    return {
      width: Math.max(1, Math.round(sourceWidth * scale)),
      height: Math.max(1, Math.round(sourceHeight * scale)),
    };
  }
}
