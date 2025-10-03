import { IsOptional, IsString, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  text: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsArray()
  removeImageIds?: string[];
}
