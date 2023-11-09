import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CompletePaymentInput {
  @Field(() => String, {
    description: '결제 상품 코드입니다. ',
    nullable: false,
  })
  productCode: string;

  @Field(() => String, {
    description: '주문 id 입니다. ',
    nullable: false,
  })
  orderId: string;

  @Field(() => String, {
    description: '결제 key 입니다. ',
    nullable: false,
  })
  paymentKey: string;

  @Field(() => String, {
    description: '결제 수단 입니다. ',
    nullable: false,
  })
  paymentMethod: string;
}
