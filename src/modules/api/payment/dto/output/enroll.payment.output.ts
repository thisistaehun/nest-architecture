import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EnrollPaymentOutput {
  @Field(() => Boolean, {
    nullable: false,
  })
  success: string;

  @Field(() => String, {
    nullable: false,
  })
  message: string;
}
