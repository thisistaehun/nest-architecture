import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserAuth } from 'src/modules/api/user/type/user.auth.type';
import { BadRequestCustomException } from 'src/modules/common/exception/bad-request.exception';
import { POINT_COMMAND_REPOSITORY, POINT_QUERY_REPOSITORY } from 'src/symbols';
import { PointCommandRepository } from '../../cqrs/command/point.command.repository';
import { PointQueryRepository } from '../../cqrs/query/point.query.repository';
import { UsePointInput } from '../../dto/use/input/use.point.input';
import { UserWallet } from '../../entities/total-point.entity';
import { PointType } from '../../type/point.type';

@Injectable()
export class UsePointUsecase {
  constructor(
    @Inject(POINT_COMMAND_REPOSITORY)
    private readonly pointCommandRepository: PointCommandRepository,
    @Inject(POINT_QUERY_REPOSITORY)
    private readonly pointQueryRepository: PointQueryRepository,
    private readonly logger: Logger,
  ) {}

  public async execute(
    input: UsePointInput,
    userAuth: UserAuth,
  ): Promise<UserWallet> {
    await this.remainPointCheck(input, userAuth);
    return this.pointCommandRepository.usePointTransaction(
      userAuth.code,
      input,
      (totalPoint: UserWallet) => {
        this.logger.verbose(
          `사용 포인트 금액: ${input.amount}, 사용 포인트 타입: ${
            input.type
          }, 총 포인트: ${
            input.type === PointType.FREE
              ? totalPoint.freePoint
              : totalPoint.paidPoint
          }`,
        );
      },
    );
  }

  private async remainPointCheck(
    input: UsePointInput,
    userAuth: UserAuth,
  ): Promise<void> {
    const totalPoint = await this.pointQueryRepository.getTotalPoint(
      userAuth.code,
    );
    if (input.type === PointType.FREE) {
      if (totalPoint.freePoint < input.amount) {
        throw new BadRequestCustomException('포인트가 부족합니다.');
      }
    } else {
      if (totalPoint.paidPoint < input.amount) {
        throw new BadRequestCustomException('포인트가 부족합니다.');
      }
    }
  }
}
