import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUsecase } from 'src/interface/usecase/usecase.interface';
import { POINT_COMMAND_REPOSITORY } from 'src/symbols';
import { PointCommandRepository } from '../../cqrs/command/point.command.repository';
import { ChargePointInput } from '../../dto/charge/input/charge.point.input';
import { UserWallet } from '../../entities/total-point.entity';
import { PointType } from '../../type/point.type';

@Injectable()
export class ChargePointUsecase
  implements IUsecase<ChargePointInput, UserWallet>
{
  constructor(
    @Inject(POINT_COMMAND_REPOSITORY)
    private readonly pointRepository: PointCommandRepository,

    private readonly logger: Logger,
  ) {}

  public async execute(
    input: ChargePointInput,
    userCode: string,
  ): Promise<UserWallet> {
    return await this.pointRepository.chargePointTransaction(
      userCode,
      input,
      (totalPoint: UserWallet) => {
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
