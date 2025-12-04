import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateInvestorDto {
  @IsOptional() @IsInt()
  apiId?: number | null;

  @IsString() @IsNotEmpty() @Length(1, 255)
  name!: string;

  @IsEmail() @Length(1, 255)
  email!: string;

  @IsOptional() @IsString() @Length(0, 255)
  legalStatus?: string | null;

  @IsOptional() @IsString() @Length(0, 255)
  address?: string | null;

  @IsOptional() @IsString() @Length(0, 50)
  phone?: string | null;

  @IsOptional()
  createdAt?: Date | null;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsString() @Length(0, 100)
  investorType?: string | null;

  @IsOptional() @IsString() @Length(0, 255)
  investmentFocus?: string | null;
}
