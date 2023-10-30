import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerificationInput {
  @Field(() => String, {
    nullable: false,
  })
  phoneNumber: string;

  @Field(() => String, {
    nullable: false,
  })
  authorizeCode: string;
}
