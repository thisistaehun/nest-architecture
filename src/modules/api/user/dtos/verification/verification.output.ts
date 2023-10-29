import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VerificationOutput {
  @Field(() => String, {
    nullable: false,
  })
  authorizeCode: string;
}
