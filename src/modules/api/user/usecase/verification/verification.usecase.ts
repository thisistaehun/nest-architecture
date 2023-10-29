import { Inject, Injectable } from '@nestjs/common';
import { IUsecase } from 'src/interface/usecase/usecase.interface';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import {
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../../../symbols';
import { UserCommandRepository } from '../../cqrs/command/user.command.repository';
import { UserQueryRepository } from '../../cqrs/query/user.query.repository';
import { VerificationInput } from '../../dtos/verification/verification.input';
import { User } from '../../entities/user.entity';
import { UserAuth } from '../../type/user.auth.type';

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
      throw new Error('인증번호가 일치하지 않습니다.');
    }

    return await this.userCommandRepository.update(user.code, {
      phoneNumber,
    });
  }
}
