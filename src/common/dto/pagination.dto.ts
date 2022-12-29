import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  offset?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  limit?: number;
}
