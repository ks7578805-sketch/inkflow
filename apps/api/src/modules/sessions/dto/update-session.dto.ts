import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSessionDto {
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;
}
