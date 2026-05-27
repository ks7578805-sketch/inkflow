import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @MaxLength(160)
  projectId!: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsString()
  @MaxLength(80)
  status!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;
}
