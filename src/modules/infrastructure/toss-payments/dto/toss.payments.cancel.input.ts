import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TossPaymentsCancelInput {
  @Field(() => String, {
    description: '결제 취소할 결제 키',
  })
  paymentKey: string;

  @Field(() => String, {
    description: '취소 사유',
  })
  cancelReason: string;
}
