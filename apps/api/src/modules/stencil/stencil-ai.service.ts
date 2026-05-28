import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenAI, Modality } from '@google/genai';
import sharp = require('sharp');
import type { CreateStencilGenerationRequest, StencilPrecheckAnalysis, StencilStylePreset, StencilVariantKind } from '@inkflow/contracts';

type ProviderMode = 'real_api';

type StyleProfile = {
  backgroundLift: number;
  localContrast: number;
  lineThreshold: number;
  lineMorphology: number;
  lineSharpness: number;
  lineGamma: number;
  lightShadeStrength: number;
  heavyShadeStrength: number;
};

const PROVIDER_NAME = 'google';
const ANALYSIS_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const VARIANT_LABELS: Record<StencilVariantKind, string> = {
  line_only: 'Fine Lines',
  light_shade: 'Soft Shade',
  heavy_shade: 'Rich Shade',
};

const STYLE_GUIDANCE: Record<StencilStylePreset, string> = {
  fine: 'fine line tattoo stencil, elegant contours, minimal shading, delicate structure, almost no filled black masses',
  bold: 'bold tattoo stencil, thicker black lines, strong silhouette, assertive readability, compact dark anchors',
  dotwork: 'dotwork tattoo stencil, dotted transitions, stippling texture, sparse solid blacks, airy gradients',
  traditional: 'traditional tattoo stencil, iconic black shapes, classic weight, decisive contrast, readable at distance',
  geometric: 'geometric tattoo stencil, precise symmetry, clean angular forms, organized negative space, crisp edge discipline',
  realism: 'realism tattoo stencil, anatomical fidelity, nuanced shading guides, preserved facial detail, controlled contrast',
};

const STYLE_PROFILES: Record<StencilStylePreset, StyleProfile> = {
  fine: {
    backgroundLift: 22,
    localContrast: 2.2,
    lineThreshold: 108,
    lineMorphology: -1,
    lineSharpness: 1.2,
    lineGamma: 1.35,
    lightShadeStrength: 0.14,
    heavyShadeStrength: 0.24,
  },
  bold: {
    backgroundLift: 12,
    localContrast: 2.7,
    lineThreshold: 126,
    lineMorphology: 1,
    lineSharpness: 1.55,
    lineGamma: 1.2,
    lightShadeStrength: 0.22,
    heavyShadeStrength: 0.38,
  },
  dotwork: {
    backgroundLift: 18,
    localContrast: 2.4,
    lineThreshold: 112,
    lineMorphology: -1,
    lineSharpness: 1.15,
    lineGamma: 1.28,
    lightShadeStrength: 0.18,
    heavyShadeStrength: 0.28,
  },
  traditional: {
    backgroundLift: 10,
    localContrast: 2.9,
    lineThreshold: 132,
    lineMorphology: 1,
    lineSharpness: 1.65,
    lineGamma: 1.18,
    lightShadeStrength: 0.24,
    heavyShadeStrength: 0.42,
  },
  geometric: {
    backgroundLift: 24,
    localContrast: 2.5,
    lineThreshold: 106,
    lineMorphology: -1,
    lineSharpness: 1.3,
    lineGamma: 1.32,
    lightShadeStrength: 0.12,
    heavyShadeStrength: 0.22,
  },
  realism: {
    backgroundLift: 16,
    localContrast: 2.6,
    lineThreshold: 116,
    lineMorphology: 0,
    lineSharpness: 1.35,
    lineGamma: 1.25,
    lightShadeStrength: 0.2,
    heavyShadeStrength: 0.34,
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
  private readonly apiKey = process.env.GOOGLE_API_KEY?.trim() ?? '';
  private readonly client = this.apiKey ? new GoogleGenAI({ apiKey: this.apiKey }) : null;

  getProviderMode(): ProviderMode {
    return 'real_api';
  }

  getProviderInfo() {
    return {
      provider: PROVIDER_NAME,
      providerMode: this.getProviderMode(),
      analysisModel: ANALYSIS_MODEL,
      imageModel: IMAGE_MODEL,
    };
  }

  async analyzeReferenceImage(source: Buffer, mimeType: string): Promise<StencilPrecheckAnalysis> {
    this.assertGoogleConfigured();
    const inlineImage = await this.buildInlineImage(source);

    try {
      const response = await this.client!.models.generateContent({
        model: ANALYSIS_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Analyze this tattoo reference image for stencil generation. Return strict JSON with keys: subject, recommendedCrop, contrastAssessment, complexity, warnings, styleHints. warnings and styleHints must be arrays of strings. Keep each field concise.' },
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

  async generateVariants(source: Buffer, mimeType: string, controls: CreateStencilGenerationRequest, analysis: StencilPrecheckAnalysis): Promise<GeneratedVariant[]> {
    this.assertGoogleConfigured();

    const sourceMeta = await sharp(source).rotate().metadata();
    const inlineImage = await this.buildInlineImage(source);

    return Promise.all((['line_only', 'light_shade', 'heavy_shade'] as StencilVariantKind[]).map(async (kind) => {
      const imageBytes = await this.generateSingleVariant(inlineImage, kind, controls, analysis);
      return this.postProcessVariant(imageBytes, kind, controls, analysis, sourceMeta.width ?? null, sourceMeta.height ?? null, this.getProviderMode());
    }));
  }

  private assertGoogleConfigured() {
    if (!this.client || !this.apiKey) {
      throw new ServiceUnavailableException('Stencil generation is unavailable because GOOGLE_API_KEY is not configured on the server.');
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

  private async generateSingleVariant(
    inlineImage: { mimeType: string; data: string },
    kind: StencilVariantKind,
    controls: CreateStencilGenerationRequest,
    analysis: StencilPrecheckAnalysis,
  ) {
    this.assertGoogleConfigured();
    const prompt = this.buildVariantPrompt(kind, controls, analysis);
    const requestConfig = {
      responseModalities: [Modality.IMAGE],
    };

    try {
      const response = await this.client!.models.generateContent({
        model: IMAGE_MODEL,
        contents: [
          { inlineData: inlineImage },
          { text: prompt },
        ],
        config: requestConfig,
      });

      const imageBuffer = this.extractGeneratedImageBuffer(response);
      if (imageBuffer) {
        return imageBuffer;
      }

      throw new BadGatewayException('Google image generation returned no image data for the stencil.');
    } catch (contentError) {
      if (contentError instanceof BadGatewayException) {
        throw contentError;
      }

      console.error('Gemini image generateContent failed', {
        kind,
        error: contentError,
      });
      throw new BadGatewayException('Google image generation failed while creating stencil variants.');
    }
  }

  private buildVariantPrompt(kind: StencilVariantKind, controls: CreateStencilGenerationRequest, analysis: StencilPrecheckAnalysis) {
    const variantInstruction = ({
      line_only: 'Create a tattoo stencil focused on fine clean contours, primary structure, and minimal shading.',
      light_shade: 'Create a tattoo stencil with clean lines and soft gray shading that preserves useful volume.',
      heavy_shade: 'Create a tattoo stencil with clean lines and richer gray shading that preserves depth and strong shadow masses.',
    } as Record<StencilVariantKind, string>)[kind];

    const hintText = analysis.styleHints.length ? analysis.styleHints.join(', ') : 'Keep the composition readable and balanced.';
    const warningText = analysis.warnings.length ? analysis.warnings.join(', ') : 'Avoid clutter and incidental artifacts.';

    return [
      variantInstruction,
      `Style direction: ${STYLE_GUIDANCE[controls.selectedStyle]}.`,
      `Main subject: ${analysis.subject}.`,
      `Crop guidance: ${analysis.recommendedCrop}.`,
      `Contrast assessment: ${analysis.contrastAssessment}.`,
      `Style hints: ${hintText}.`,
      `Warnings: ${warningText}.`,
      'Preserve helpful support shapes and tonal context when they improve stencil readability.',
      'Simplify the background, but do not erase all surrounding visual mass.',
      'White background. Black and gray stencil only.',
      'No text. No watermark. No extra elements. Return image only.',
    ].join(' ');
  }

  private async postProcessVariant(
    sourceBuffer: Buffer,
    kind: StencilVariantKind,
    controls: CreateStencilGenerationRequest,
    analysis: StencilPrecheckAnalysis,
    sourceWidth: number | null,
    sourceHeight: number | null,
    providerMode: ProviderMode,
  ): Promise<GeneratedVariant> {
    const target = OUTPUT_SIZES[controls.outputSize];
    const profile = STYLE_PROFILES[controls.selectedStyle];

    const prepared = await sharp(sourceBuffer)
      .rotate()
      .flatten({ background: '#ffffff' })
      .resize(target.width, target.height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .grayscale()
      .normalise()
      .clahe({ width: 8, height: 8, maxSlope: Math.round(profile.localContrast * 10) })
      .linear(1.02, profile.backgroundLift - 6)
      .median(controls.simplify > 60 ? 2 : 1)
      .png()
      .toBuffer();

    const lineThreshold = this.clamp(
      profile.lineThreshold
        + Math.round((controls.simplify - 30) * 0.12)
        + Math.round((controls.lineThickness - 50) * 0.04),
      88,
      148,
    );

    const lineMorphology = profile.lineMorphology + (controls.lineThickness >= 72 ? 1 : controls.lineThickness <= 32 ? -1 : 0);
    const lineLayer = await this.buildLineLayer(prepared, lineThreshold, profile, lineMorphology);
    const composites = await this.buildVariantComposites(prepared, lineLayer, kind, controls, profile);

    const final = await sharp({
      create: {
        width: target.width,
        height: target.height,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .composite(composites)
      .png()
      .toBuffer();

    const meta = await sharp(final).metadata();

    return {
      kind,
      label: VARIANT_LABELS[kind],
      bytes: final,
      mimeType: 'image/png',
      width: meta.width ?? target.width,
      height: meta.height ?? target.height,
      metadata: {
        preset: controls.selectedStyle,
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
        provider: PROVIDER_NAME,
        model: IMAGE_MODEL,
        providerMode,
      },
    };
  }

  private async buildVariantComposites(prepared: Buffer, lineLayer: Buffer, kind: StencilVariantKind, controls: CreateStencilGenerationRequest, profile: StyleProfile) {
    const composites: Array<{ input: Buffer; blend?: 'multiply'; opacity?: number }> = [];

    if (kind === 'light_shade') {
      composites.push({
        input: await this.buildShadeLayer(prepared, {
          blur: 1.15,
          gamma: 1.06,
          gain: 0.82,
          offset: 92,
          opacity: this.clamp(profile.lightShadeStrength * 0.7 + (controls.layerCount - 2) * 0.02, 0.08, 0.18),
        }),
        blend: 'multiply',
      });
      composites.push({
        input: await this.buildShadeLayer(prepared, {
          blur: 0.65,
          gamma: 1.03,
          gain: 0.72,
          offset: 72,
          opacity: this.clamp(profile.lightShadeStrength + (controls.layerCount - 2) * 0.03, 0.14, 0.3),
        }),
        blend: 'multiply',
      });
    }

    if (kind === 'heavy_shade') {
      composites.push({
        input: await this.buildShadeLayer(prepared, {
          blur: 1.25,
          gamma: 1.04,
          gain: 0.84,
          offset: 88,
          opacity: this.clamp(profile.lightShadeStrength * 0.8 + 0.06 + (controls.layerCount - 2) * 0.03, 0.16, 0.28),
        }),
        blend: 'multiply',
      });
      composites.push({
        input: await this.buildShadeLayer(prepared, {
          blur: 0.9,
          gamma: 1.01,
          gain: 0.68,
          offset: 66,
          opacity: this.clamp(profile.lightShadeStrength + 0.1 + (controls.layerCount - 2) * 0.03, 0.22, 0.38),
        }),
        blend: 'multiply',
      });
      composites.push({
        input: await this.buildShadeLayer(prepared, {
          blur: 0.4,
          gamma: 1.01,
          gain: 0.58,
          offset: 44,
          opacity: this.clamp(profile.heavyShadeStrength + (controls.layerCount - 2) * 0.04, 0.3, 0.58),
        }),
        blend: 'multiply',
      });
    }

    composites.push({ input: lineLayer, blend: 'multiply' });
    return composites;
  }

  private async buildLineLayer(prepared: Buffer, threshold: number, profile: StyleProfile, morphology: number) {
    let pipeline = sharp(prepared)
      .gamma(profile.lineGamma)
      .linear(1.0, -8)
      .sharpen(profile.lineSharpness + 0.25, 1.0, 2)
      .threshold(threshold);

    if (morphology < 0) {
      pipeline = pipeline.erode(Math.abs(morphology));
    }
    if (morphology > 0) {
      pipeline = pipeline.dilate(morphology);
    }

    return pipeline.png().toBuffer();
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

  private extractGeneratedImageBuffer(response: {
    data?: string;
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: { data?: string | null } | null;
        }>;
      };
    }>;
  } | any) {
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
}
