import { IsInt, IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateEventDto {
  @IsOptional() @IsInt()
  apiId?: number | null;

  @IsString() @IsNotEmpty() @Length(1, 255)
  name!: string;

  @IsOptional() @IsString()
  dates?: string | null;

  @IsOptional() @IsString() @Length(0, 255)
  location?: string | null;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsString() @Length(0, 100)
  eventType?: string | null;

  @IsOptional() @IsString() @Length(0, 255)
  targetAudience?: string | null;
}
