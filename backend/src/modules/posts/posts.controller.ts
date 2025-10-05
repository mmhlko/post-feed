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
  UseGuards,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { PostsService } from './posts.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { AccessGuard } from '../auth/guards/access.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { filenameGenerator } from 'src/shared/utils/filename-generator';

const PostImagesInterceptor = (field = 'images', maxCount = 5) =>
  UseInterceptors(
    FilesInterceptor(field, maxCount, {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: filenameGenerator,
      }),
    }),
  );
@UseGuards(AccessGuard)
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
    @GetUser('userId') userId: string,
  ) {
    return this.postsService.create(body, userId, images);
  }

  @Patch(':id')
  @PostImagesInterceptor()
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
    @GetUser('userId') userId: string,
  ) {
    return this.postsService.update(id, dto, userId, images);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.postsService.delete(id, userId);
  }
}
