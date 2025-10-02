import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostModel } from './post.model';
import { PostImageModel } from './post-image.model';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UserModel } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([PostModel, PostImageModel, UserModel])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [SequelizeModule],
})
export class PostsModule {}
