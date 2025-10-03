import {
  Body,
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshGuard } from './guards/refresh.guard';
import { AccessGuard } from './guards/access.guard';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { GetUser, type UserPayload } from './decorators/get-user.decorator';
import { type Response } from 'express';

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/auth/refresh', // только для refresh запроса
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    sameSite: 'lax', // защита от CSRF
  });
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signup(dto);
    setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
    return { accessToken };
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  refresh(@GetUser() user: UserPayload) {
    console.log('Refresh request received, user:', user);
    if (!user.refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return this.authService.refreshTokens(user.userId, user.refreshToken);
  }

  @UseGuards(AccessGuard)
  @Post('logout')
  async logout(
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    return { ok: true };
  }
}
