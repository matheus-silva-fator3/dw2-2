import { IsOptional, IsString, Max, MaxLength } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;
}
