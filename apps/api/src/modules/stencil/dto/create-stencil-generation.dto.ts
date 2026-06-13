import { IsBoolean, IsHexColor, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

const STENCIL_STYLE_PRESETS = ['fineline', 'blackwork', 'realismo'] as const;
const STENCIL_OUTPUT_SIZES = ['a4', 'a3', 'letter', 'custom'] as const;
const STENCIL_PROVIDERS = ['google', 'openai'] as const;

export class CreateStencilGenerationDto {
  @IsString()
  @MaxLength(160)
  assetId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  projectId?: string | null;

  @IsString()
  @IsIn(STENCIL_STYLE_PRESETS)
  selectedStyle!: (typeof STENCIL_STYLE_PRESETS)[number];

  @IsInt()
  @Min(0)
  @Max(100)
  lineThickness!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  simplify!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  layerCount!: number;

  @IsString()
  @IsHexColor()
  lineColor!: string;

  @IsString()
  @IsIn(STENCIL_OUTPUT_SIZES)
  outputSize!: (typeof STENCIL_OUTPUT_SIZES)[number];

  @IsOptional()
  @IsString()
  @IsIn(STENCIL_PROVIDERS)
  provider?: (typeof STENCIL_PROVIDERS)[number];

  // Outline-only mode (no white background, no shading) — produces a
  // transparent PNG with just the tinted contour lines. Matches the
  // "PNG sem fundo" workflow tattoo artists use to drop straight into Procreate.
  @IsOptional()
  @IsBoolean()
  transparentBackground?: boolean;

  // Hybrid-slider knobs derived from a single "Intensidade" control on
  // the UI. Optional, 0–100, default 50 each when absent.
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  contrast?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  detail?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  brightness?: number;
}
