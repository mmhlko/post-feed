import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { ProfileController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [ProfileController],
  providers: [UsersService],
  exports: [SequelizeModule],
})
export class UsersModule {}
