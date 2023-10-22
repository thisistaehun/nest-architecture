import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JwtAuthService } from 'src/modules/infrastructure/auth/service/jwt.auth.service';
import { envVariables } from 'src/modules/infrastructure/config/env-config';

import { SocialLoginInput } from '../../dtos/login/input/social-login.input';
import { SocialLoginOutput } from '../../dtos/login/output/social-login.output';
import { User } from '../../entities/user.entity';
import { LoginType } from '../../type/login.type';
import { UserRepository } from '../../user.repository';

@Injectable()
export class SocialLoginUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async execute(input: SocialLoginInput): Promise<SocialLoginOutput> {
    const { type, token } = input;
    const result = await axios.get(envVariables.KAKAO_GET_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      params: {
        property_keys: ['kakao_account.email'],
      },
    });

    const savedUser = await this.userRepository.findOneByEmail(
      result.data.kakao_account.email,
    );
    if (savedUser) {
      return this.handleExistingUser(type, savedUser);
    } else {
      return this.createNewUser(
        type,
        result.data.kakao_account.email,
        result.data.properties.nickname,
        result.data.id,
      );
    }

    return {
      user: null,
      accessToken: '',
      refreshToken: '',
    };
  }

  private async createNewUser(
    type: LoginType,
    email: string,
    nickname: string,
    socialId: string,
  ) {
    const user = this.userRepository.create({
      name: nickname,
      email,
      nickname,
      socialId,
      loginType: type,
    });

    const savedUser = await this.userRepository.save(user);

    const { accessToken, refreshToken } =
      this.jwtAuthService.createAccessAndRefreshToken(user);

    return {
      user: savedUser,
      accessToken,
      refreshToken,
    };
  }

  private async handleExistingUser(givenType: LoginType, savedUser: User) {
    if (savedUser.loginType !== givenType) {
      throw new Error('다른 소셜로 가입된 이메일입니다.');
    }

    const { accessToken, refreshToken } =
      this.jwtAuthService.createAccessAndRefreshToken(savedUser);

    return {
      user: savedUser,
      accessToken,
      refreshToken,
    };
  }
}
