import { Inject, Injectable } from '@nestjs/common';
import { ITypeORMCommandRepository } from 'src/interface/cqrs/command.repository.interface';
import { User } from 'src/modules/api/user/entities/user.entity';
import { Transactional } from 'src/modules/infrastructure/transaction/transaction.decorator';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from 'src/modules/infrastructure/transaction/transaction.manager';
import { ChargePointInput } from '../../dto/charge/input/charge.point.input';
import { PointTransaction } from '../../entities/point-transaction.entity';
import { TotalPoint } from '../../entities/total-point.entity';
import { PointType } from '../../type/point.type';

@Injectable()
export class PointCommandRepository implements ITypeORMCommandRepository {
  constructor(
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  public txEntityManager() {
    return this.transactionManager.getEntityManager();
  }

  @Transactional()
  public async chargePointTransaction(
    userCode: string,
    input: ChargePointInput,
    cb?: (totalPoint: TotalPoint) => void,
  ): Promise<TotalPoint> {
    const targetUser = await this.txEntityManager().findOneOrFail(User, {
      where: {
        code: userCode,
      },
      relations: {
        point: {
          pointTransactions: true,
        },
      },
    });

    const chargePointTransaction = this.txEntityManager().create(
      PointTransaction,
      {
        amount: input.amount,
        type: input.type,
        totalPoint: targetUser.point,
      },
    );

    await this.txEntityManager().save(PointTransaction, chargePointTransaction);

    switch (input.type) {
      case PointType.FREE:
        targetUser.point.freePoint += input.amount;
        break;
      case PointType.PAID:
        targetUser.point.paidPoint += input.amount;
        break;
    }

    const result = await this.txEntityManager().save(
      TotalPoint,
      targetUser.point,
    );

    if (cb) {
      cb(result);
    }

    return result;
  }
}
