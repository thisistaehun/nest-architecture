import { Inject, Injectable } from '@nestjs/common';
import { ITypeORMCommandRepository } from 'src/interface/cqrs/command.repository.interface';
import { User } from 'src/modules/api/user/entities/user.entity';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from 'src/modules/infrastructure/transaction/transaction.manager';
import { POINT_CALCULATOR } from 'src/symbols';
import { ChargePointInput } from '../../dto/charge/input/charge.point.input';
import { UsePointInput } from '../../dto/use/input/use.point.input';
import { PointTransaction } from '../../entities/point-transaction.entity';
import { UserWallet } from '../../entities/total-point.entity';
import { PointTransactionType } from '../../type/point.transaction.type';
import { PointType } from '../../type/point.type';
import { PointCalculator } from './point.operation.helper';

@Injectable()
export class PointCommandRepository implements ITypeORMCommandRepository {
  constructor(
    @Inject(TRANSACTION_MANAGER)
    private readonly txManager: TransactionManager,
    @Inject(POINT_CALCULATOR)
    private readonly pointCalculator: PointCalculator,
  ) {}

  public txEntityManager() {
    return this.txManager.getEntityManager();
  }

  public async chargePointTransaction(
    userCode: string,
    input: ChargePointInput,
    cb?: (totalPoint: UserWallet) => void,
  ): Promise<UserWallet> {
    return this.processPointTransaction(
      userCode,
      input,
      PointTransactionType.CHARGE,
      this.pointCalculator.sumPoint,
      cb,
    );
  }

  async usePointTransaction(
    userCode: string,
    input: UsePointInput,
    cb?: (totalPoint: UserWallet) => void,
  ): Promise<UserWallet> {
    return this.processPointTransaction(
      userCode,
      input,
      PointTransactionType.USE,
      this.pointCalculator.subtractPoint,
      cb,
    );
  }

  private async processPointTransaction(
    userCode: string,
    input: ChargePointInput | UsePointInput,
    transactionType: PointTransactionType,
    operationFunc: (a: number, b: number) => number,
    cb?: (totalPoint: UserWallet) => void,
  ): Promise<UserWallet> {
    const targetUser = await this.txEntityManager().findOneOrFail(User, {
      where: {
        code: userCode,
      },
      relations: {
        userWallet: {
          pointTransactions: true,
          user: true,
        },
      },
    });

    const pointTransaction = this.txEntityManager().create(PointTransaction, {
      amount: input.amount,
      type: input.type,
      totalPoint: targetUser.userWallet,
      transactionType: transactionType,
    });

    const savedPointTransaction = await this.txEntityManager().save(
      PointTransaction,
      pointTransaction,
    );

    targetUser.userWallet.pointTransactions.push(savedPointTransaction);

    switch (input.type) {
      case PointType.FREE:
        targetUser.userWallet.freePoint = operationFunc(
          targetUser.userWallet.freePoint,
          input.amount,
        );
        break;
      case PointType.PAID:
        targetUser.userWallet.paidPoint = operationFunc(
          targetUser.userWallet.paidPoint,
          input.amount,
        );
        break;
    }

    const result = await this.txEntityManager().save(
      UserWallet,
      targetUser.userWallet,
    );

    if (cb) {
      cb(result);
    }

    return result;
  }
}
