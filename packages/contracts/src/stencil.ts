export const STENCIL_STYLE_PRESETS = ['fine', 'bold', 'dotwork', 'traditional', 'geometric', 'realism'] as const;
export type StencilStylePreset = (typeof STENCIL_STYLE_PRESETS)[number];

export const STENCIL_VARIANT_KINDS = ['line_only', 'light_shade', 'heavy_shade'] as const;
export type StencilVariantKind = (typeof STENCIL_VARIANT_KINDS)[number];

export const STENCIL_OUTPUT_SIZES = ['a4', 'a3', 'letter', 'custom'] as const;
export type StencilOutputSize = (typeof STENCIL_OUTPUT_SIZES)[number];

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
  provider: 'google';
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
};

export type SaveStencilVersionRequest = {
  projectId?: string | null;
};
