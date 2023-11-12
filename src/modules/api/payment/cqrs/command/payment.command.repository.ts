import { Inject, Injectable } from '@nestjs/common';
import { ITypeORMCommandRepository } from 'src/interface/cqrs/command.repository.interface';
import { PointCalculator } from 'src/modules/api/point/cqrs/command/point.operation.helper';
import { PointTransaction } from 'src/modules/api/point/entities/point-transaction.entity';
import { UserWallet } from 'src/modules/api/point/entities/total-point.entity';
import { PointTransactionType } from 'src/modules/api/point/type/point.transaction.type';
import { PointType } from 'src/modules/api/point/type/point.type';
import { UserRankPolicy } from 'src/modules/api/policy/entities/user-rank.policy.entity';
import { Product } from 'src/modules/api/product/entity/product.entity';
import { User } from 'src/modules/api/user/entities/user.entity';
import { UserRank } from 'src/modules/api/user/type/user.rank.type';
import { DGLogger } from 'src/modules/infrastructure/logger/logger';
import { Transactional } from 'src/modules/infrastructure/transaction/transaction.decorator';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from 'src/modules/infrastructure/transaction/transaction.manager';
import { DG_LOGGER, POINT_CALCULATOR } from 'src/symbols';
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
    @Inject(DG_LOGGER)
    private readonly logger: DGLogger,
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
    const paymentOrder = await this.createPaymentOrder(
      orderInput,
      product,
      user,
    );
    await this.createPointTransactions(
      freePoints,
      gradeReflectedPaidPoints,
      totalPoint,
      paymentOrder,
      user,
    );

    const userWallet = await this.updateUserWallet(
      totalPoint,
      freePoints,
      gradeReflectedPaidPoints,
      product,
      user,
    );

    await this.txEntityManager().update(
      PaymentOrder,
      {
        id: paymentOrder.id,
      },
      {
        status: PaymentStatus.SUCCESS,
      },
    );
    this.logger.log(
      `사용자(${user.nickname}) 주문 상태 변경 완료: ${paymentOrder.id}`,
    );

    await this.updateUserRank(userWallet, user);

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

  private async updateUserRank(userWallet: UserWallet, user: User) {
    const userRankPolicy = await this.txEntityManager().findOne(
      UserRankPolicy,
      {
        order: {
          createdAt: 'DESC',
        },
      },
    );
    this.changeUserRank(userWallet, userRankPolicy, user);

    const updateResult = await this.txEntityManager().update(User, user.id, {
      rank: user.rank,
    });

    if (updateResult.affected !== 1) {
    }
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

    const updateResult = await this.txEntityManager().update(User, user.id, {
      rank: user.rank,
    });

    if (updateResult.affected !== 1) {
      this.logger.log(`사용자(${user.nickname}) 등급 변경 없음: ${user.rank}`);
    } else {
      this.logger.log(`사용자(${user.nickname}) 등급 변경 완료: ${user.rank}`);
    }
  }

  private async createPaymentOrder(
    orderInput: CompletePaymentInput,
    product: Product,
    user: User,
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

    const savedResult = await this.txEntityManager().save(paymentOrder);
    this.logger.log(
      `사용자(${user.nickname}) 결제 주문 생성 완료: ${savedResult.id}`,
    );
    return savedResult;
  }

  private async createPointTransactions(
    freePoints: number,
    gradeReflectedPaidPoints: number,
    totalPoint: UserWallet,
    paymentOrder: PaymentOrder,
    user: User,
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
    this.logger.log(
      `사용자(${user.nickname}) 포인트 충전 완료(무료: ${freePoints}, 유료: ${gradeReflectedPaidPoints})`,
    );
  }

  private async updateUserWallet(
    userWallet: UserWallet,
    freePoints: number,
    gradeReflectedPaidPoints: number,
    product: Product,
    user: User,
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
    this.logger.log(
      `사용자(${user.nickname}) 지갑 업데이트 완료(무료: ${freePoints}, 유료: ${gradeReflectedPaidPoints})`,
    );

    return this.txEntityManager().findOne(UserWallet, {
      where: {
        id: userWallet.id,
      },
    });
  }
}
