import { IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsString()
  @MaxLength(160)
  clientId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  artistName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  style?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  bodyPart?: string;

  @IsString()
  @MaxLength(80)
  status!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  valueEstimated?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  valueFinal?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  deposit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalPaid?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sessionsDone?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sessionsTotal?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  hoursEstimated?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  hoursReal?: number;

  @IsOptional()
  @IsDateString()
  nextSessionAt?: string | null;

  @IsOptional()
  @IsDateString()
  nextSessionEndAt?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  nextSessionStatus?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  thumbnailUrl?: string;
}
