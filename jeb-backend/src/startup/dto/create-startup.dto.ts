import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt, IsUrl, Length } from 'class-validator';

export class CreateStartupDto {
  @IsOptional() @IsInt()
  apiId?: number | null;

  @IsString() @IsNotEmpty() @Length(1, 255)
  name!: string;

  @IsOptional() @IsString() @Length(0, 255)
  legalStatus?: string | null;

  @IsOptional() @IsString() @Length(0, 255)
  address?: string | null;

  @IsEmail() @Length(1, 255)
  email!: string;

  @IsOptional() @IsString() @Length(0, 50)
  phone?: string | null;

  @IsOptional()
  createdAt?: Date | null;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsString()
  websiteUrl?: string | null;

  @IsOptional() @IsString()
  socialMediaUrl?: string | null;

  @IsOptional() @IsString() @Length(0, 100)
  projectStatus?: string | null;

  @IsOptional() @IsString()
  needs?: string | null;

  @IsOptional() @IsString() @Length(0, 100)
  sector?: string | null;

  @IsOptional() @IsString() @Length(0, 100)
  maturity?: string | null;
}
