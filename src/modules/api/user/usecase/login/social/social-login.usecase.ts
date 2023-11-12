import { Inject, Injectable } from '@nestjs/common';
import { JwtAuthService } from 'src/modules/infrastructure/auth/service/jwt.auth.service';

import { BadRequestCustomException } from 'src/modules/common/exception/bad-request.exception';
import { DGLogger } from 'src/modules/infrastructure/logger/logger';
import {
  DG_LOGGER,
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../../../../symbols';
import { SocialLoginInput } from '../../../dto/login/input/social-login.input';
import { SocialLoginOutput } from '../../../dto/login/output/social-login.output';
import { User } from '../../../entities/user.entity';
import { UserCommandRepository } from '../../../repository/command/user.command.repository';
import { UserQueryRepository } from '../../../repository/query/user.query.repository';
import { LoginType } from '../../../type/login.type';
import { SocialProfileProvider } from './social-profile.provider';

@Injectable()
export class SocialLoginUsecase {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    @Inject(USER_COMMAND_REPOSITORY)
    private readonly userCommandRepository: UserCommandRepository,
    @Inject(DG_LOGGER)
    private readonly logger: DGLogger,
    private readonly jwtAuthService: JwtAuthService,
    private readonly socialProfileProvider: SocialProfileProvider,
  ) {}

  async execute(input: SocialLoginInput): Promise<SocialLoginOutput> {
    const profile = await this.socialProfileProvider.getProfile(input);
    const savedUser = await this.userRepository.findOneByEmail(profile.email);
    if (savedUser) {
      return this.handleExistingUser(input.type, savedUser);
    } else {
      return this.createNewUser(input.type, profile.email, profile.socialId);
    }
  }

  private async createNewUser(
    type: LoginType,
    email: string,

    socialId: string,
  ) {
    const savedUser = await this.userCommandRepository.signUpTransaction(
      {
        email,
        socialId,
        loginType: type,
      },
      async (user: User) => {
        this.logger.log(`| SAVE USER | ${user.loginType} | ${user.email} `);
      },
    );

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
      throw new BadRequestCustomException('다른 소셜로 가입된 이메일입니다.');
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
