import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import { WithdrawInput } from '../../dtos/withdraw/input/withdraw.input';
import { WithdrawOutput } from '../../dtos/withdraw/output/withdraw.output';
import { UserAuth } from '../../type/user.auth.type';
import { UserRepository } from '../../user.repository';

@Injectable()
export class WithdrawUsecase {
  constructor(
    private readonly userRepository: UserRepository,
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
      throw new Error('인증 코드가 일치하지 않습니다.');
    }

    const success = await this.userRepository.softDelete(code);

    return {
      success,
      message: success
        ? '회원 탈퇴에 성공했습니다.'
        : '회원 탈퇴에 실패했습니다.',
      user: success ? savedUser : null,
    };
  }
}
