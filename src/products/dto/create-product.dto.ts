import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsString()
  @IsOptional()
  @MinLength(1)
  description?: string;
  @IsNumber()
  @IsPositive()
  stock: number;
  @IsString({ each: true })
  @IsArray()
  sizes: string[];
  @IsIn(['MEN', 'WOMEN', 'KID', 'GIRL', 'UNISEX'])
  gender: string;
}
