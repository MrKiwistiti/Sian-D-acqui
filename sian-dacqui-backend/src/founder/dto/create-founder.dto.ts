import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateFounderDto {
  @IsOptional() @IsInt()
  apiId?: number | null;

  @IsString() @Length(1, 255)
  name!: string;

  @IsOptional() @IsInt()
  startupId?: number | null;
}
