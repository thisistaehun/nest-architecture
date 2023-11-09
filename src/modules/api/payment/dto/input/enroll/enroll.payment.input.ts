import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EnrollPaymentInput {
  @Field(() => String, {
    description: '결제 수단',
  })
  paymentMethod: string;

  @Field(() => String, {
    description: '주문 식별 ID',
  })
  orderId: string;

  @Field(() => String, {
    description: '주문 상품 코드',
  })
  productCode: string;
}
