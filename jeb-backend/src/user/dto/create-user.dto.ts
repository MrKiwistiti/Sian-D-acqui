import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsOptional() @IsInt()
  apiId?: number | null;

  @IsEmail() @Length(1, 255)
  email!: string;

  @IsString() @IsNotEmpty() @Length(1, 255)
  name!: string;

  @IsString() @IsNotEmpty() @Length(1, 100)
  role!: string;

  @IsOptional() @IsInt()
  founderId?: number | null;

  @IsOptional() @IsInt()
  investorId?: number | null;

  @IsOptional() @IsString() @MinLength(6)
  password?: string;
}
