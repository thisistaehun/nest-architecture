import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class WithdrawInput {
  @Field(() => String, {
    nullable: false,
    description: '문자로 받은 6자리 인증 코드를 입력하세요.',
  })
  authorizeCode: string;
}
