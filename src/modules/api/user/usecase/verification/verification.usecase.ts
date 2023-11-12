import { Inject, Injectable } from '@nestjs/common';
import { IUsecase } from 'src/interface/usecase/usecase.interface';
import { UnauthorizedCustomException } from 'src/modules/common/exception/unauthorized-exception';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import {
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../../../symbols';
import { VerificationInput } from '../../dto/verification/input/verification.input';
import { User } from '../../entities/user.entity';
import { UserCommandRepository } from '../../repository/command/user.command.repository';
import { UserQueryRepository } from '../../repository/query/user.query.repository';
import { UserAuth } from '../../type/user.auth.type';
import { UserRole } from '../../type/user.role';

@Injectable()
export class VerficationUsecase implements IUsecase<VerificationInput, User> {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    @Inject(USER_COMMAND_REPOSITORY)
    private readonly userCommandRepository: UserCommandRepository,
    private readonly redisService: RedisService,
  ) {}

  public async execute(
    { phoneNumber, authorizeCode }: VerificationInput,
    userAuth: UserAuth,
  ): Promise<User> {
    const user = await this.userRepository.findOneByCode(userAuth.code);
    const savedAuthorizeCode = await this.redisService.get(
      `sign-up::${user.code}::${phoneNumber}`,
    );

    if (savedAuthorizeCode !== authorizeCode) {
      throw new UnauthorizedCustomException('인증번호가 일치하지 않습니다.');
    }

    const existCheck = await this.userRepository.findOneByPhoneNumber(
      phoneNumber,
    );

    if (existCheck) {
      throw new UnauthorizedCustomException(
        `이미 가입된 전화번호입니다. 
        email: ${existCheck.email} 
        loginType: ${existCheck.loginType}`,
      );
    }

    return await this.userCommandRepository.update(user.code, {
      phoneNumber,
      role: UserRole.FREE_USER,
    });
  }
}
