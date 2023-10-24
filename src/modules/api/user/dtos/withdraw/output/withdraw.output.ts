import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../entities/user.entity';

@ObjectType()
export class WithdrawOutput {
  @Field(() => Boolean, {
    nullable: false,
  })
  success: boolean;

  @Field(() => String, {
    nullable: false,
  })
  message: string;

  @Field(() => User, {
    nullable: false,
  })
  user: User;
}
