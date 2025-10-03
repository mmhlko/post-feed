import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshGuard } from './guards/refresh.guard';
import { AccessGuard } from './guards/access.guard';
import { LoginDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refreshTokens(
      req.user.userId,
      req.user.refreshToken,
    );
  }

  @UseGuards(AccessGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user.userId);
  }
}
