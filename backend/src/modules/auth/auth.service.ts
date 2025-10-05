import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtAccessSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtAccessExpire: string;
  private readonly jwtRefreshExpire: string;
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    this.jwtAccessSecret = configService.get<string>('JWT_ACCESS_SECRET') || '';
    this.jwtRefreshSecret =
      configService.get<string>('JWT_REFRESH_SECRET') || '';
    this.jwtAccessExpire =
      configService.get<string>('JWT_ACCESS_EXPIRE') || '15m';
    this.jwtRefreshExpire =
      configService.get<string>('JWT_REFRESH_EXPIRE') || '7d';
  }

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hash,
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Access Denied');

    const rtMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!rtMatches) throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    if (!refreshToken) {
      return this.usersService.updateRefreshToken(userId, null);
    }
    const hash = await bcrypt.hash(refreshToken, 10);
    return this.usersService.updateRefreshToken(userId, hash);
  }

  private async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        {
          secret: this.jwtAccessSecret,
          expiresIn: this.jwtAccessExpire,
        },
      ),
      this.jwtService.signAsync(
        { userId, email },
        { secret: this.jwtRefreshSecret, expiresIn: this.jwtRefreshExpire },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
