import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PointTransaction } from '../../point/entities/point-transaction.entity';
import { Product } from '../../product/entity/product.entity';
import { PaymentStatus } from '../enum/payment.status';

@Entity({ name: 'payment_order' })
@ObjectType({ description: '결제 주문' })
export class PaymentOrder extends CommonEntity {
  @Field(() => String, { description: '결제 주문 아이디' })
  @Column({ type: 'varchar', length: 100, unique: true })
  orderId: string;

  @Field(() => String, { description: '결제 키' })
  @Column({ type: 'varchar', length: 100 })
  paymentKey: string;

  @Field(() => String, { description: '결제 수단' })
  @Column({ type: 'varchar', length: 100 })
  paymentMethod: string;

  @Field(() => String, { description: '결제 금액' })
  @Column({ type: 'int' })
  price: number;

  @Field(() => PaymentStatus, { description: '결제 상태' })
  @Column({ type: 'varchar', length: 100 })
  status: PaymentStatus;

  @Field(() => Product, { description: '결제 상품' })
  @ManyToOne(() => Product, (product) => product.paymentOrders)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Field(() => [PointTransaction], { description: '포인트 거래' })
  @OneToMany(
    () => PointTransaction,
    (pointTransaction) => pointTransaction.paymentOrder,
  )
  pointTransactions: PointTransaction[];
}
