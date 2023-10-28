import { Injectable } from '@nestjs/common';
import { JwtAuthService } from 'src/modules/infrastructure/auth/service/jwt.auth.service';

import { SocialLoginInput } from '../../../dtos/login/input/social-login.input';
import { SocialLoginOutput } from '../../../dtos/login/output/social-login.output';
import { User } from '../../../entities/user.entity';
import { LoginType } from '../../../type/login.type';
import { UserRepository } from '../../../user.repository';
import { SocialProfileProvider } from './social-profile.provider';

@Injectable()
export class SocialLoginUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService,
    private readonly socialProfileProvider: SocialProfileProvider,
  ) {}

  async execute(input: SocialLoginInput): Promise<SocialLoginOutput> {
    const profile = await this.socialProfileProvider.getProfile(input);

    const savedUser = await this.userRepository.findOneByEmail(profile.email);
    if (savedUser) {
      return this.handleExistingUser(input.type, savedUser);
    } else {
      return this.createNewUser(
        input.type,
        profile.email,
        profile.name,
        profile.socialId,
      );
    }
  }

  private async createNewUser(
    type: LoginType,
    email: string,
    nickname: string,
    socialId: string,
  ) {
    const savedUser = await this.userRepository.signUpTransaction({
      name: nickname,
      email,
      nickname,
      socialId,
      loginType: type,
    });

    const { accessToken, refreshToken } =
      this.jwtAuthService.createAccessAndRefreshToken(savedUser);

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
