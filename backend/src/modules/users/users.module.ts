import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { ProfileController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [ProfileController],
})
export class UsersModule {}
