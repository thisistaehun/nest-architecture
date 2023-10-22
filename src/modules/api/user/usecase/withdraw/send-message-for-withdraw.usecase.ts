import { Injectable } from '@nestjs/common';
import { AwsSnsService } from 'src/modules/infrastructure/aws/ses/aws.sns.service';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import { UserAuth } from '../../type/user.auth.type';
import { UserRepository } from '../../user.repository';

@Injectable()
export class SendMessageForWithdrawUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly snsService: AwsSnsService,
    private readonly redisService: RedisService,
  ) {}

  async execute(user: UserAuth) {
    const targetUser = await this.userRepository.findOneByCode(user.code);
    const authorizeCode = this.createRandomSixDigitNumber();
    await this.snsService.sendMessage(
      '+82' + targetUser.phoneNumber,
      authorizeCode,
    );

    await this.redisService.set(
      `withdraw-${targetUser.code}`,
      authorizeCode,
      1000 * 60 * 3,
    );

    return true;
  }

  private createRandomSixDigitNumber(): string {
    const randomNumber = Math.floor(Math.random() * 1000000);
    if (randomNumber < 100000) {
      return this.createRandomSixDigitNumber();
    }
    return randomNumber.toString();
  }
}
