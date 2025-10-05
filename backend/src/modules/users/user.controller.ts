import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AccessGuard } from '../auth/guards/access.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { filenameGenerator } from 'src/shared/utils/filename-generator';

@UseGuards(AccessGuard)
@Controller('user')
export class ProfileController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getProfile(@GetUser('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @Patch()
  updateProfile(
    @GetUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.update(userId, dto);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: filenameGenerator,
      }),
    }),
  )
  async uploadAvatar(
    @GetUser('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = file ? `/uploads/avatars/${file.filename}` : '';
    return this.userService.updateAvatar(userId, url);
  }
}
