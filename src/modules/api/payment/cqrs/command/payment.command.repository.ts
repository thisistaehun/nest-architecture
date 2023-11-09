import { Inject, Injectable } from '@nestjs/common';
import { ITypeORMCommandRepository } from 'src/interface/cqrs/command.repository.interface';
import { PointCalculator } from 'src/modules/api/point/cqrs/command/point.operation.helper';
import { PointTransaction } from 'src/modules/api/point/entities/point-transaction.entity';
import { TotalPoint } from 'src/modules/api/point/entities/total-point.entity';
import { PointTransactionType } from 'src/modules/api/point/type/point.transaction.type';
import { PointType } from 'src/modules/api/point/type/point.type';
import { Product } from 'src/modules/api/product/entity/product.entity';
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
    orderInput: CompletePaymentInput,
    totalPoint: TotalPoint,
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
    await this.updateTotalPoint(
      totalPoint,
      freePoints,
      gradeReflectedPaidPoints,
    );
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
    totalPoint: TotalPoint,
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
      freePointTransaction.save(),
      paidPointTransaction.save(),
    ]);
  }

  private async updateTotalPoint(
    totalPoint: TotalPoint,
    freePoints: number,
    gradeReflectedPaidPoints: number,
  ): Promise<void> {
    const updateResult = await this.txEntityManager().update(
      TotalPoint,
      totalPoint.id,
      {
        freePoint: Number(totalPoint.freePoint) + Number(freePoints),
        paidPoint:
          Number(totalPoint.paidPoint) + Number(gradeReflectedPaidPoints),
      },
    );

    if (updateResult.affected !== 1) {
      throw new Error('포인트 충전에 실패했습니다.');
    }
  }
}
