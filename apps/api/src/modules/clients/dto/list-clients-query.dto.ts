import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListClientsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}
