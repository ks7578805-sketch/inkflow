import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class ListSessionsDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  projectId?: string;
}
