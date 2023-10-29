import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUsecase } from 'src/interface/usecase/usecase.interface';
import { POINT_COMMAND_REPOSITORY } from 'src/symbols';
import { UserAuth } from '../../../user/type/user.auth.type';
import { PointCommandRepository } from '../../cqrs/command/point.command.repository';
import { ChargePointInput } from '../../dto/charge/input/charge.point.input';
import { TotalPoint } from '../../entities/total-point.entity';
import { PointType } from '../../type/point.type';

@Injectable()
export class ChargePointUsecase
  implements IUsecase<ChargePointInput, TotalPoint>
{
  constructor(
    @Inject(POINT_COMMAND_REPOSITORY)
    private readonly pointRepository: PointCommandRepository,

    private readonly logger: Logger,
  ) {}

  public async execute(
    input: ChargePointInput,
    userAuth: UserAuth,
  ): Promise<TotalPoint> {
    return await this.pointRepository.chargePointTransaction(
      userAuth.code,
      input,
      (totalPoint: TotalPoint) => {
        this.logger.verbose(
          `충전 포인트 금액: ${input.amount}, 충전 포인트 타입: ${
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
