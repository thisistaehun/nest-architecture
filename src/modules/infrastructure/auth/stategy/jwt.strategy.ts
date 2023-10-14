import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/modules/api/user/entities/user.entity';
import { AccessTokenPayload } from '../type/access-token.payload';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  validate(payload: AccessTokenPayload): Partial<User> {
    return {
      code: payload.sub,
      email: payload.email,
      nickname: payload.nickname,
    };
  }
}
