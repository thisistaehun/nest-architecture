import { Inject, Injectable } from '@nestjs/common';
import { IUsecase } from 'src/interface/usecase/usecase.interface';
import { UnauthorizedCustomException } from 'src/modules/common/exception/unauthorized-exception';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import {
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../../../symbols';
import { WithdrawInput } from '../../dto/withdraw/input/withdraw.input';
import { WithdrawOutput } from '../../dto/withdraw/output/withdraw.output';
import { UserCommandRepository } from '../../repository/command/user.command.repository';
import { UserQueryRepository } from '../../repository/query/user.query.repository';
import { UserAuth } from '../../type/user.auth.type';

@Injectable()
export class WithdrawUsecase
  implements IUsecase<WithdrawInput, WithdrawOutput>
{
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    @Inject(USER_COMMAND_REPOSITORY)
    private readonly userCommandRepository: UserCommandRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(
    input: WithdrawInput,
    userAuth: UserAuth,
  ): Promise<WithdrawOutput> {
    const { authorizeCode } = input;
    const { code } = userAuth;

    const savedUser = await this.userRepository.findOneByCode(code);

    const saved = await this.redisService.get(`withdraw-${code}`);

    if (saved !== authorizeCode) {
      throw new UnauthorizedCustomException('인증 코드가 일치하지 않습니다.');
    }

    const success = await this.userCommandRepository.softDelete(code);

    return {
      success,
      message: success
        ? '회원 탈퇴에 성공했습니다.'
        : '회원 탈퇴에 실패했습니다.',
      user: success ? savedUser : null,
    };
  }
}
