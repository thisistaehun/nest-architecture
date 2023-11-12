import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApolloError } from 'apollo-server-core';
import { User } from 'src/modules/api/user/entities/user.entity';
import { envVariables } from '../../config/env-config';
import { AccessTokenPayload } from '../type/access-token.payload';
import { RefreshTokenPayload } from '../type/refresh-token.payload';

@Injectable()
export class JwtAuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(private readonly jwtService: JwtService) {
    this.accessTokenSecret = envVariables.JWT_ACCESS_TOKEN_SECRET;
    this.refreshTokenSecret = envVariables.JWT_REFRESH_TOKEN_SECRET;
    this.accessExpiresIn = envVariables.JWT_ACCESS_TOKEN_EXPIRES_IN;
    this.refreshExpiresIn = envVariables.JWT_REFRESH_TOKEN_EXPIRES_IN;
  }

  // TODO : this method should save refresh token at database
  public createAccessAndRefreshToken(user: User) {
    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user.code);
    return {
      accessToken,
      refreshToken,
    };
  }

  public createAccessToken(user: User): string {
    const accessTokenPayload: Partial<AccessTokenPayload> = {
      sub: user.code,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
    };

    return this.jwtService.sign(accessTokenPayload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessExpiresIn,
    });
  }

  public createRefreshToken(code: string): string {
    const refreshTokenPayload: Partial<RefreshTokenPayload> = {
      sub: code,
    };

    return this.jwtService.sign(refreshTokenPayload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshExpiresIn,
    });
  }

  public verifyAccessToken(accessToken: string): AccessTokenPayload {
    return this.jwtService.verify(accessToken, {
      secret: this.accessTokenSecret,
      ignoreExpiration: false,
    });
  }

  public verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.refreshTokenSecret,
        ignoreExpiration: false,
      });
    } catch (err) {
      throw new ApolloError('유효하지 않은 토큰입니다.', 'INVALID_TOKEN', {
        status: 401,
      });
    }
  }

  public decodeAccessToken(accessToken: string): AccessTokenPayload {
    return this.jwtService.decode(accessToken, {
      json: true,
    }) as AccessTokenPayload;
  }

  public decodeRefreshToken(refreshToken: string): RefreshTokenPayload {
    return this.jwtService.decode(refreshToken, {
      json: true,
    }) as RefreshTokenPayload;
  }
}
