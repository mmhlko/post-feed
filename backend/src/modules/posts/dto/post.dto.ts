import { IsOptional, IsString, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  text: string;

  // файлы передаются как multipart images[]
  @IsOptional()
  userId: string; // в реале — берем из токена
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsArray()
  removeImageIds?: string[];
}
