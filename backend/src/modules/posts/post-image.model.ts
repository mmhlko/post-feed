import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PostModel } from './post.model';

@Table({ tableName: 'post_images' })
export class PostImageModel extends Model<PostImageModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING })
  url: string;

  @ForeignKey(() => PostModel)
  @Column({ type: DataType.UUID, allowNull: false })
  postId: string;

  @BelongsTo(() => PostModel)
  post: PostModel;
}
