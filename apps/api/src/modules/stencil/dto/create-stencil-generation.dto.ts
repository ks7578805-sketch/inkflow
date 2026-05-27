import { IsHexColor, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

const STENCIL_STYLE_PRESETS = ['fine', 'bold', 'dotwork', 'traditional', 'geometric', 'realism'] as const;
const STENCIL_OUTPUT_SIZES = ['a4', 'a3', 'letter', 'custom'] as const;

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
}
