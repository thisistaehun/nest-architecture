import { Inject, Injectable } from '@nestjs/common';
import { ITypeORMCommandRepository } from 'src/interface/cqrs/command.repository.interface';
import { User } from 'src/modules/api/user/entities/user.entity';
import { Transactional } from 'src/modules/infrastructure/transaction/transaction.decorator';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from 'src/modules/infrastructure/transaction/transaction.manager';
import { POINT_OPERATION_HELPER } from 'src/symbols';
import { ChargePointInput } from '../../dto/charge/input/charge.point.input';
import { UsePointInput } from '../../dto/use/input/use.point.input';
import { PointTransaction } from '../../entities/point-transaction.entity';
import { TotalPoint } from '../../entities/total-point.entity';
import { PointTransactionType } from '../../type/point.transaction.type';
import { PointType } from '../../type/point.type';
import { PointOperationHelper } from './point.operation.helper';

@Injectable()
export class PointCommandRepository implements ITypeORMCommandRepository {
  constructor(
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
    @Inject(POINT_OPERATION_HELPER)
    private readonly pointOperationHelper: PointOperationHelper,
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
    return this.processPointTransaction(
      userCode,
      input,
      PointTransactionType.CHARGE,
      this.pointOperationHelper.sumPoint,
      cb,
    );
  }

  @Transactional()
  async usePointTransaction(
    userCode: string,
    input: UsePointInput,
    cb?: (totalPoint: TotalPoint) => void,
  ): Promise<TotalPoint> {
    return this.processPointTransaction(
      userCode,
      input,
      PointTransactionType.USE,
      this.pointOperationHelper.subtractPoint,
      cb,
    );
  }

  private async processPointTransaction(
    userCode: string,
    input: ChargePointInput | UsePointInput,
    transactionType: PointTransactionType,
    operationFunc: (a: number, b: number) => number,
    cb?: (totalPoint: TotalPoint) => void,
  ): Promise<TotalPoint> {
    const targetUser = await this.txEntityManager().findOneOrFail(User, {
      where: {
        code: userCode,
      },
      relations: {
        point: {
          pointTransactions: true,
          user: true,
        },
      },
    });

    const pointTransaction = this.txEntityManager().create(PointTransaction, {
      amount: input.amount,
      type: input.type,
      totalPoint: targetUser.point,
      transactionType: transactionType,
    });

    const savedPointTransaction = await this.txEntityManager().save(
      PointTransaction,
      pointTransaction,
    );

    targetUser.point.pointTransactions.push(savedPointTransaction);

    switch (input.type) {
      case PointType.FREE:
        targetUser.point.freePoint = operationFunc(
          targetUser.point.freePoint,
          input.amount,
        );
        break;
      case PointType.PAID:
        targetUser.point.paidPoint = operationFunc(
          targetUser.point.paidPoint,
          input.amount,
        );
        break;
    }

    const result = await this.txEntityManager().save(
      TotalPoint,
      targetUser.point,
    );
    console.log(result);

    if (cb) {
      cb(result);
    }

    return result;
  }
}
