import { Inject, Injectable } from '@nestjs/common';
import { UtilService } from 'src/modules/common/util/util.service';
import { AwsSnsService } from 'src/modules/infrastructure/aws/ses/aws.sns.service';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import { USER_QUERY_REPOSITORY } from '../../../../../symbols';
import { UserQueryRepository } from '../../repository/query/user.query.repository';
import { UserAuth } from '../../type/user.auth.type';

@Injectable()
export class SendMessageForWithdrawUsecase {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    private readonly snsService: AwsSnsService,
    private readonly redisService: RedisService,
    private readonly utilService: UtilService,
  ) {}

  async execute(user: UserAuth) {
    const targetUser = await this.userRepository.findOneByCode(user.code);
    const authorizeCode = this.utilService.createRandomSixDigitNumber();
    await this.snsService.sendMessage(
      '+82' + targetUser.phoneNumber,
      `
      [너두 마케터]
      회원 탈퇴를 위한 인증번호는 ${authorizeCode} 입니다.
      `,
    );

    await this.redisService.set(
      `withdraw-${targetUser.code}`,
      authorizeCode,
      1000 * 60 * 3,
    );

    return true;
  }
}
