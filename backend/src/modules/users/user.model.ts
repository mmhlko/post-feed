import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { PostModel } from '../posts/post.model';

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ allowNull: true })
  declare firstName: string;

  @Column({ allowNull: true })
  declare lastName: string;

  @Column({ allowNull: true })
  declare birthDate: Date;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare about: string;

  @Column({ allowNull: true })
  declare email: string;

  @Column({ allowNull: true })
  declare phone: string;

  @Column({ allowNull: true })
  declare avatarUrl: string;

  @HasMany(() => PostModel)
  declare posts: PostModel[];
}
