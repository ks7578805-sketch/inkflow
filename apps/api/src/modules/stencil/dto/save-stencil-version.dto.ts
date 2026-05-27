import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SaveStencilVersionDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  projectId?: string | null;
}
