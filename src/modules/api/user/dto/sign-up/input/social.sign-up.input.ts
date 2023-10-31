import { Field, InputType } from '@nestjs/graphql';
import { SignUpInput } from './sign-up.input';

@InputType()
export class SocialSignUpInput extends SignUpInput {
  @Field(() => String, {
    description: '소셜 로그인 타입',
  })
  type: string;

  @Field(() => String, {
    description: '소셜 아이디',
  })
  socialId: string;
}
