// 3 style presets — aligned with the most-used tattoo styles by professional
// artists in 2026 (Fine Line, Blackwork, Realism). One style ⇒ one variant.
export const STENCIL_STYLE_PRESETS = ['fineline', 'blackwork', 'realismo'] as const;
export type StencilStylePreset = (typeof STENCIL_STYLE_PRESETS)[number];

// VariantKind kept as a separate type so the DB enum can keep legacy values
// without breaking older rows. New generations always use one of the 3 below.
export const STENCIL_VARIANT_KINDS = [
  'fineline',
  'blackwork',
  'realismo',
  // Legacy variants kept for historical rows — never produced by new code.
  'line_only',
  'light_shade',
  'heavy_shade',
] as const;
export type StencilVariantKind = (typeof STENCIL_VARIANT_KINDS)[number];

// 1:1 mapping between style and its variant. Locks the relationship so the
// front-end and back-end don't drift.
export const STYLE_TO_VARIANT: Record<StencilStylePreset, StencilVariantKind> = {
  fineline: 'fineline',
  blackwork: 'blackwork',
  realismo: 'realismo',
};

export const STENCIL_OUTPUT_SIZES = ['a4', 'a3', 'letter', 'custom'] as const;
export type StencilOutputSize = (typeof STENCIL_OUTPUT_SIZES)[number];

// Provider lets the front-end pick which image API generates the stencil.
// Phase B adds the OpenAI gpt-image-2 path; phase A only exposes 'google'.
export const STENCIL_PROVIDERS = ['google', 'openai'] as const;
export type StencilProvider = (typeof STENCIL_PROVIDERS)[number];

export type StencilAssetDto = {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  publicUrl: string;
  createdAt: string;
};

export type StencilVersionMetadata = {
  preset: StencilStylePreset;
  variant: StencilVariantKind;
  outputSize: StencilOutputSize;
  lineThickness: number;
  simplify: number;
  layerCount: number;
  lineColor: string;
  sourceWidth: number | null;
  sourceHeight: number | null;
  generatedAt: string;
  provider: StencilProvider;
  model: string;
  providerMode: 'real_api';
};

export type StencilVersionDto = {
  id: string;
  generationId: string;
  kind: StencilVariantKind;
  label: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  publicUrl: string;
  metadata: StencilVersionMetadata;
  savedAt: string | null;
  createdAt: string;
};

export type StencilPrecheckAnalysis = {
  subject: string;
  recommendedCrop: string;
  contrastAssessment: string;
  complexity: string;
  warnings: string[];
  styleHints: string[];
};

export type StencilGenerationDto = {
  id: string;
  assetId: string;
  projectId: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  selectedStyle: StencilStylePreset;
  lineThickness: number;
  simplify: number;
  layerCount: number;
  lineColor: string;
  outputSize: StencilOutputSize;
  provider: StencilProvider;
  analysis: StencilPrecheckAnalysis | null;
  savedVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  asset: StencilAssetDto;
  versions: StencilVersionDto[];
};

export type CreateStencilGenerationRequest = {
  assetId: string;
  projectId?: string | null;
  selectedStyle: StencilStylePreset;
  lineThickness: number;
  simplify: number;
  layerCount: number;
  lineColor: string;
  outputSize: StencilOutputSize;
  provider?: StencilProvider; // optional in phase A — defaults to 'google'
  // Outline-only mode: when true the API emits a transparent PNG with only
  // the tinted contour lines (no shading, no white canvas) so the file can
  // be dropped straight into Procreate/Photoshop as a transfer overlay.
  transparentBackground?: boolean;
  // Hybrid-slider knobs derived from a single "Intensidade" control on the
  // UI. All optional, all 0–100. The backend injects them into the prompt
  // (textual hints to the AI) AND into the Sharp post-processing
  // (numerical adjustments to threshold / brightness / etc.).
  contrast?: number;    // 0 = soft transitions, 100 = pushed contrast
  detail?: number;      // 0 = simplified, 100 = preserve every recognisable feature
  brightness?: number;  // 0 = darker overall, 100 = brighter overall
};

export type SaveStencilVersionRequest = {
  projectId?: string | null;
};
