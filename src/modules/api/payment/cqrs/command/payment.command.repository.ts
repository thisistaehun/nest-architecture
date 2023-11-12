import { Inject, Injectable } from '@nestjs/common';
import { ITypeORMCommandRepository } from 'src/interface/cqrs/command.repository.interface';
import { PointCalculator } from 'src/modules/api/point/cqrs/command/point.operation.helper';
import { PointTransaction } from 'src/modules/api/point/entities/point-transaction.entity';
import { UserWallet } from 'src/modules/api/point/entities/total-point.entity';
import { PointTransactionType } from 'src/modules/api/point/type/point.transaction.type';
import { PointType } from 'src/modules/api/point/type/point.type';
import { UserRankPolicy } from 'src/modules/api/policy/user-rank.policy.entity';
import { Product } from 'src/modules/api/product/entity/product.entity';
import { User } from 'src/modules/api/user/entities/user.entity';
import { UserRank } from 'src/modules/api/user/type/user.rank.type';
import { Transactional } from 'src/modules/infrastructure/transaction/transaction.decorator';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from 'src/modules/infrastructure/transaction/transaction.manager';
import { POINT_CALCULATOR } from 'src/symbols';
import { CompletePaymentInput } from '../../dto/input/complete/complete.payment.input';
import { PaymentOrder } from '../../entities/payment.order.entity';
import { PaymentStatus } from '../../enum/payment.status';

@Injectable()
export class PaymentCommandRepository implements ITypeORMCommandRepository {
  constructor(
    @Inject(TRANSACTION_MANAGER)
    private readonly txManager: TransactionManager,
    @Inject(POINT_CALCULATOR)
    private readonly pointCalculator: PointCalculator,
  ) {}

  public txEntityManager() {
    return this.txManager.getEntityManager();
  }

  @Transactional()
  async chargePointByPaymentTransaction(
    user: User,
    orderInput: CompletePaymentInput,
    totalPoint: UserWallet,
    product: Product,
    freePoints: number,
    gradeReflectedPaidPoints: number,
  ): Promise<PaymentOrder> {
    const paymentOrder = await this.createPaymentOrder(orderInput, product);
    await this.createPointTransactions(
      freePoints,
      gradeReflectedPaidPoints,
      totalPoint,
      paymentOrder,
    );

    const userWallet = await this.updateUserWallet(
      totalPoint,
      freePoints,
      gradeReflectedPaidPoints,
      product,
    );

    const userRankPolicy: UserRankPolicy = await this.txEntityManager().findOne(
      UserRankPolicy,
      {
        order: {
          createdAt: 'DESC',
        },
      },
    );

    await this.changeUserRank(userWallet, userRankPolicy, user);

    return this.txEntityManager().findOne(PaymentOrder, {
      where: {
        id: paymentOrder.id,
      },
      relations: {
        pointTransactions: {
          totalPoint: {
            user: true,
          },
        },
        product: true,
      },
    });
  }

  private async changeUserRank(
    userWallet: UserWallet,
    userRankPolicy: UserRankPolicy,
    user: User,
  ) {
    if (userWallet.cumulativeCharged >= userRankPolicy.expertChargeAmount) {
      user.rank = UserRank.EXPERT;
    } else if (
      userWallet.cumulativeCharged >= userRankPolicy.advancedChargeAmount
    ) {
      user.rank = UserRank.ADVANCED;
    } else if (
      userWallet.cumulativeCharged >= userRankPolicy.intermediateChargeAmount
    ) {
      user.rank = UserRank.INTERMEDIATE;
    } else if (
      userWallet.cumulativeCharged >= userRankPolicy.amateurChargeAmount
    ) {
      user.rank = UserRank.AMATEUR;
    } else if (
      userWallet.cumulativeCharged >= userRankPolicy.beginnerChargeAmount
    ) {
      user.rank = UserRank.BEGINNER;
    }

    await this.txEntityManager().update(User, user.id, {
      rank: user.rank,
    });
  }

  private async createPaymentOrder(
    orderInput: CompletePaymentInput,
    product: Product,
  ): Promise<PaymentOrder> {
    const paymentOrder: PaymentOrder = this.txEntityManager().create(
      PaymentOrder,
      {
        orderId: orderInput.orderId,
        paymentKey: orderInput.paymentKey,
        paymentMethod: orderInput.paymentMethod,
        price: product.price,
        status: PaymentStatus.WAITING,
        product,
      },
    );
    await paymentOrder.save();
    return paymentOrder;
  }

  private async createPointTransactions(
    freePoints: number,
    gradeReflectedPaidPoints: number,
    totalPoint: UserWallet,
    paymentOrder: PaymentOrder,
  ): Promise<void> {
    const freePointTransaction = this.txEntityManager().create(
      PointTransaction,
      {
        amount: freePoints,
        type: PointType.FREE,
        transactionType: PointTransactionType.CHARGE,
        totalPoint,
        paymentOrder,
      },
    );

    const paidPointTransaction = this.txEntityManager().create(
      PointTransaction,
      {
        amount: gradeReflectedPaidPoints,
        type: PointType.PAID,
        transactionType: PointTransactionType.CHARGE,
        totalPoint,
        paymentOrder,
      },
    );

    await Promise.all([
      this.txEntityManager().save(freePointTransaction),
      this.txEntityManager().save(paidPointTransaction),
    ]);
  }

  private async updateUserWallet(
    userWallet: UserWallet,
    freePoints: number,
    gradeReflectedPaidPoints: number,
    product: Product,
  ): Promise<UserWallet> {
    const updateResult = await this.txEntityManager().update(
      UserWallet,
      userWallet.id,
      {
        freePoint: this.pointCalculator.sumPoint(
          Number(userWallet.freePoint),
          Number(freePoints),
        ),
        paidPoint: this.pointCalculator.sumPoint(
          Number(userWallet.paidPoint),
          Number(gradeReflectedPaidPoints),
        ),
        cumulativeCharged: this.pointCalculator.sumPoint(
          Number(userWallet.cumulativeCharged),
          Number(product.price),
        ),
      },
    );

    if (updateResult.affected !== 1) {
      throw new Error('포인트 충전에 실패했습니다.');
    }

    return this.txEntityManager().findOne(UserWallet, {
      where: {
        id: userWallet.id,
      },
    });
  }
}
