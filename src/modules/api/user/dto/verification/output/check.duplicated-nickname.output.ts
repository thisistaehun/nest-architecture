import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CheckDuplicatedNicknameOutput {
  @Field(() => Boolean, { nullable: false })
  valid: boolean;

  @Field(() => String, { nullable: false })
  message: string;
}
