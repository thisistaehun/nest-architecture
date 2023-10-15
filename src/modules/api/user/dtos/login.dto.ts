import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String, {
    description: '이메일',
  })
  email: string;

  @Field(() => String, {
    description: '비밀번호',
  })
  password: string;
}

@ObjectType()
export class LoginOutput {
  @Field(() => String, {
    description: 'JWT 액세스 토큰',
  })
  accessToken: string;
  @Field(() => String, {
    description: 'JWT 리프레쉬 토큰',
  })
  refreshToken: string;
}
