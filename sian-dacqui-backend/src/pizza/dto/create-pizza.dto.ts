import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, Min } from 'class-validator';

export class CreatePizzaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  preparationTime?: number;

  @IsBoolean()
  @IsOptional()
  vegetarian?: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  ingredientIds?: number[];
}
