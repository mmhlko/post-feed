import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { UserModel } from '../users/user.model';
import { PostImageModel } from './post-image.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({ tableName: 'posts' })
export class PostModel extends Model<
  InferAttributes<PostModel>,
  InferCreationAttributes<PostModel>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true,
  })
  declare id: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare text: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @HasMany(() => PostImageModel, { onDelete: 'CASCADE' })
  declare images: PostImageModel[];
}
