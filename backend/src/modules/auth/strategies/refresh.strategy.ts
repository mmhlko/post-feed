import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

function extractRefreshToken(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'refreshToken') {
      return value;
    }
  }
  return null;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = extractRefreshToken(req);
          console.log('Extracted refresh token:', token);
          return token;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
      passReqToCallback: true, // если нужен req в validate
    });
  }

  validate(req: Request, payload: any) {
    console.log('payload', payload);
    return payload;
  }
}
