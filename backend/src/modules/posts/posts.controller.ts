import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Query,
  UseInterceptors,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { PostsService } from './posts.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

const filenameGenerator = (
  req,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const name = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${extname(file.originalname)}`;
  cb(null, name);
};

const PostImagesInterceptor = (field = 'images', maxCount = 5) =>
  UseInterceptors(
    FilesInterceptor(field, maxCount, {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: filenameGenerator,
      }),
    }),
  );

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  list(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
  ) {
    return this.postsService.list({
      limit: Number(limit) || 5,
      offset: Number(offset) || 0,
      sort,
    });
  }

  @HttpPost()
  @PostImagesInterceptor()
  create(
    @Body() body: CreatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.postsService.create(body, images);
  }

  @Patch(':id')
  @PostImagesInterceptor()
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.postsService.update(id, dto, images);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
