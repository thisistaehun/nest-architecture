import { Field, ObjectType } from '@nestjs/graphql';
import { PaymentOrder } from '../../entities/payment.order.entity';

@ObjectType()
export class CompletePaymentOutput {
  @Field(() => Boolean, { description: '결제 완료 여부' })
  success: boolean;

  @Field(() => String, { description: '결제 완료 메시지' })
  message: string;

  @Field(() => PaymentOrder, { description: '결제 완료 코드' })
  paymentOrder: PaymentOrder;
}
