import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { NotFoundCustomException } from 'src/modules/common/exception/not-found.exception';
import { UtilService } from 'src/modules/common/util/util.service';
import { AwsSnsService } from 'src/modules/infrastructure/aws/ses/aws.sns.service';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import { USER_QUERY_REPOSITORY } from '../../../../../symbols';
import { UserQueryRepository } from '../../repository/query/user.query.repository';
import { UserAuth } from '../../type/user.auth.type';

@Injectable()
export class SendMessageForVerificationUsecase {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    private readonly snsService: AwsSnsService,
    private readonly redisService: RedisService,
    private readonly utilService: UtilService,
  ) {}

  public async execute(user: UserAuth, phoneNumber: string): Promise<boolean> {
    await this.checkExistPhoneNumber(phoneNumber);
    const targetUser = await this.userRepository.findOneByCode(user.code);
    if (!targetUser) {
      throw new NotFoundCustomException('존재하지 않는 회원입니다.');
    }
    const authorizeCode = this.utilService.createRandomSixDigitNumber();

    await this.snsService.sendMessage(
      '+82' + phoneNumber,
      `
    [너두 마케터]
    회원 인증을 위한 인증번호는 ${authorizeCode} 입니다.
    `,
    );

    await this.redisService.set(
      `sign-up::${targetUser.code}::${phoneNumber}`,
      authorizeCode,
      1000 * 60 * 30,
    );

    return true;
  }

  private async checkExistPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findOneByPhoneNumber(phoneNumber);
    if (user) {
      throw new ConflictException('이미 가입된 전화번호입니다.');
    }
  }
}
