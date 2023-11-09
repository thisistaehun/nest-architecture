import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentOrder } from '../../payment/entities/payment.order.entity';
import { PointTransactionType } from '../type/point.transaction.type';
import { PointType } from '../type/point.type';
import { TotalPoint } from './total-point.entity';

@Entity({ name: 'point_transaction' })
@ObjectType({ description: 'Point' })
export class PointTransaction extends CommonEntity {
  @Field(() => Number, { description: '포인트 금액' })
  @Column({ name: 'amount', type: 'bigint' })
  amount: number;

  @Field(() => PointType, { description: '포인트 타입' })
  @Column({ name: 'type', type: 'varchar', length: 45 })
  type: PointType;

  @Field(() => PointTransactionType, { description: '포인트 트랜잭션 타입' })
  @Column({ name: 'transaction_type', type: 'varchar', length: 45 })
  transactionType: PointTransactionType;

  @Field(() => TotalPoint, { description: '총 포인트' })
  @ManyToOne(() => TotalPoint, (point: TotalPoint) => point.pointTransactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'point_id' })
  totalPoint: TotalPoint;

  @Field(() => PaymentOrder, { description: '결제 주문' })
  @ManyToOne(
    () => PaymentOrder,
    (paymentOrder: PaymentOrder) => paymentOrder.pointTransactions,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'payment_order_id' })
  paymentOrder: PaymentOrder;
}
