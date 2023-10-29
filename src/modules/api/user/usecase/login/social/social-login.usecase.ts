import { Inject, Injectable } from '@nestjs/common';
import { JwtAuthService } from 'src/modules/infrastructure/auth/service/jwt.auth.service';

import {
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../../../../symbols';
import { UserCommandRepository } from '../../../cqrs/command/user.command.repository';
import { UserQueryRepository } from '../../../cqrs/query/user.query.repository';
import { SocialLoginInput } from '../../../dtos/login/input/social-login.input';
import { SocialLoginOutput } from '../../../dtos/login/output/social-login.output';
import { User } from '../../../entities/user.entity';
import { LoginType } from '../../../type/login.type';
import { SocialProfileProvider } from './social-profile.provider';

@Injectable()
export class SocialLoginUsecase {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    private readonly jwtAuthService: JwtAuthService,
    private readonly socialProfileProvider: SocialProfileProvider,
    @Inject(USER_COMMAND_REPOSITORY)
    private readonly userCommandRepository: UserCommandRepository,
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
    const savedUser = await this.userCommandRepository.signUpTransaction({
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
