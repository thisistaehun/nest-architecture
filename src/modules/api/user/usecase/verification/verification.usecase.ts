import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import { VerificationInput } from '../../dtos/verification/verification.input';
import { User } from '../../entities/user.entity';
import { UserAuth } from '../../type/user.auth.type';
import { UserRepository } from '../../user.repository';

@Injectable()
export class VerficationUsecase {
  constructor(
    private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    userAuth: UserAuth,
    { phoneNumber, authorizeCode }: VerificationInput,
  ): Promise<User> {
    const user = await this.userRepository.findOneByCode(userAuth.code);
    const savedAuthorizeCode = await this.redisService.get(
      `sign-up::${user.code}::${phoneNumber}`,
    );

    if (savedAuthorizeCode !== authorizeCode) {
      throw new Error('인증번호가 일치하지 않습니다.');
    }

    return await this.userRepository.update(user.code, {
      phoneNumber,
    });
  }
}
