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
import { extname } from 'path';
import { AccessGuard } from '../auth/guards/access.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

// function filenameGenerator(
//   _: any,
//   file: Express.Multer.File,
//   cb: (error: Error | null, filename: string) => void,
// ) {
//   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//   cb(null, uniqueSuffix + extname(file.originalname));
// }
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
        filename: (req, file, cb) => {
          const name = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}${extname(file.originalname)}`;
          cb(null, name);
        },
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
