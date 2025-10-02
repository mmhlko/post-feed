import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// function filenameGenerator(
//   _: any,
//   file: Express.Multer.File,
//   cb: (error: Error | null, filename: string) => void,
// ) {
//   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//   cb(null, uniqueSuffix + extname(file.originalname));
// }

@Controller('user')
export class ProfileController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  getProfile(@Param('id') id: string) {
    console.log('getProfile', id);
    return this.userService.findById(id);
  }

  @Patch(':id')
  updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    console.log('updateProfile', id, dto);

    return this.userService.update(id, dto);
  }

  @Post(':id/avatar')
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
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = file ? `/uploads/avatars/${file.filename}` : '';
    return this.userService.updateAvatar(id, url);
  }
}
