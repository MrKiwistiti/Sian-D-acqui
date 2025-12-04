import { IsInt, IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateNewsDto {
  @IsOptional() @IsInt()
  apiId?: number | null;

  @IsString() @IsNotEmpty() @Length(1, 255)
  title!: string;

  @IsOptional()
  newsDate?: Date | null;

  @IsOptional() @IsString() @Length(0, 255)
  location?: string | null;

  @IsOptional() @IsString() @Length(0, 100)
  category?: string | null;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsInt()
  startupId?: number | null;
}

