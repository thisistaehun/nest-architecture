import { Field, InputType } from '@nestjs/graphql';
import { SignUpInput } from './sign-up.input';

@InputType()
export class EmailSignUpInput extends SignUpInput {
  @Field(() => String, {
    description: '비밀번호',
  })
  password: string;

  @Field(() => String, {
    description: '비밀번호 확인',
  })
  repassword: string;
}
