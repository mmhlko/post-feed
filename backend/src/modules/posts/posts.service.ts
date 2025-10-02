import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from './post.model';
import { PostImageModel } from './post-image.model';
import {
  CreationAttributes,
  InferCreationAttributes,
  Op,
  Order,
} from 'sequelize';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
type ListParams = { limit: number; offset: number; sort: string };

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel) private readonly postModel: typeof PostModel,
    @InjectModel(PostImageModel)
    private readonly postImageModel: typeof PostImageModel,
  ) {}

  async list({ limit, offset, sort }: ListParams) {
    const order: Order = [['createdAt', sort?.toUpperCase()]];
    const { rows, count } = await this.postModel.findAndCountAll({
      include: [PostImageModel],
      limit,
      offset,
      order,
    });
    return { items: rows, total: count };
  }

  async create(
    dto: CreatePostDto & { userId: string },
    images?: Express.Multer.File[],
  ) {
    const post = await this.postModel.create({
      userId: dto.userId,
      text: dto.text,
    } as InferCreationAttributes<PostModel>);

    if (images && images.length > 0) {
      const imageRecords = images.map((file) => ({
        postId: post.id,
        url: `/uploads/posts/${file.filename}`,
      })) as CreationAttributes<PostImageModel>[];

      await this.postImageModel.bulkCreate(imageRecords);
    }

    return this.findById(post.id);
  }

  async findById(id: string) {
    const post = await this.postModel.findByPk(id, {
      include: [PostImageModel],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, dto: UpdatePostDto, images?: Express.Multer.File[]) {
    const post = await this.postModel.findByPk(id, {
      include: [PostImageModel],
    });
    if (!post) throw new NotFoundException('Post not found');

    if (dto.text) {
      post.text = dto.text;
      await post.save();
    }

    if (images && images.length > 0) {
      const imageRecords = images.map((file) => ({
        postId: post.id,
        url: `/uploads/posts/${file.filename}`,
      })) as CreationAttributes<PostImageModel>[];
      await this.postImageModel.bulkCreate(imageRecords);
    }

    if (dto.removeImageIds && dto.removeImageIds.length > 0) {
      await this.postImageModel.destroy({
        where: { id: { [Op.in]: dto.removeImageIds }, postId: id },
      });
    }

    return this.findById(id);
  }

  async delete(id: string) {
    const post = await this.postModel.findByPk(id, {
      include: [PostImageModel],
    });
    if (!post) throw new NotFoundException('Post not found');

    await this.postImageModel.destroy({ where: { postId: id } });
    await post.destroy();
    return { ok: true };
  }
}
