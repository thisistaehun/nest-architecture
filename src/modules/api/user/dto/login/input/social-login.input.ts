import { Field, InputType } from '@nestjs/graphql';
import { LoginType } from '../../../type/login.type';

@InputType()
export class SocialLoginInput {
  @Field(() => LoginType, {
    description: '소셜 로그인 타입',
  })
  type: LoginType;

  @Field(() => String, {
    description: '소셜 로그인 토큰',
  })
  token: string;
}
