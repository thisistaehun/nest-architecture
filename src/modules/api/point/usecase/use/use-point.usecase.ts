import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserAuth } from 'src/modules/api/user/type/user.auth.type';
import { POINT_COMMAND_REPOSITORY } from 'src/symbols';
import { PointCommandRepository } from '../../cqrs/command/point.command.repository';
import { UsePointInput } from '../../dto/use/input/use.point.input';
import { TotalPoint } from '../../entities/total-point.entity';
import { PointType } from '../../type/point.type';

@Injectable()
export class UsePointUsecase {
  constructor(
    @Inject(POINT_COMMAND_REPOSITORY)
    private readonly pointCommandRepository: PointCommandRepository,
    private readonly logger: Logger,
  ) {}

  public async execute(
    input: UsePointInput,
    userAuth: UserAuth,
  ): Promise<TotalPoint> {
    return this.pointCommandRepository.usePointTransaction(
      userAuth.code,
      input,
      (totalPoint: TotalPoint) => {
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
}
