import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  async findById(id: string) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async create(data: Partial<UserModel>) {
    return this.userModel.create(data as any);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    const user = await this.findById(userId);
    user.hashedRefreshToken = refreshToken;
    return user.save();
  }

  async update(id: string, dto: UpdateProfileDto) {
    const user = await this.findById(id);
    await user.update(dto);
    return user;
  }

  async updateAvatar(id: string, avatarUrl: string) {
    const user = await this.findById(id);
    user.avatarUrl = avatarUrl;
    return await user.save();
  }
}
