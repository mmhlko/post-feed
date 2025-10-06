import { IsOptional, IsString, IsEmail, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return null;
    if (value instanceof Date) return value;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed;
  })
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
