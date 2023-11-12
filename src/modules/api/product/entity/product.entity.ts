import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PaymentOrder } from '../../payment/entities/payment.order.entity';

@InputType({ isAbstract: true })
@ObjectType({ description: '결제 상품' })
@Entity({ name: 'payment_product' })
export class Product extends CommonEntity {
  @Field(() => String, {
    description: '결제 상품 이름',
    nullable: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Field(() => Number, {
    description: '결제 상품 가격 VAT 포함',
    nullable: false,
  })
  @Column({ type: 'int', nullable: false, default: 0 })
  price: number;

  @Field(() => Number, {
    description: '결제 상품 유료 포인트',
    nullable: false,
  })
  @Column({ type: 'int', default: 0 })
  paidPoints: number;

  @Field(() => Number, {
    description: '결제 상품 무료 포인트',
    nullable: true,
  })
  @Column({ type: 'int', default: 0 })
  freePoints: number;

  @Field(() => [PaymentOrder], {
    description: '결제 상품 구매 내역',
    nullable: true,
  })
  @OneToMany(() => PaymentOrder, (paymentOrders) => paymentOrders.product)
  paymentOrders: PaymentOrder[];
}
