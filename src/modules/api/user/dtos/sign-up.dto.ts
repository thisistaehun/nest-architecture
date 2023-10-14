import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class SignUpInput extends PickType(User, [
  'name',
  'nickname',
  'email',
  'password',
]) {
  @Field(() => String, {
    description: '비밀번호 확인',
  })
  repassword: string;
}

@ObjectType()
export class SignUpOutput {
  @Field(() => User)
  user: User;

  @Field(() => String, {
    description: 'JWT 액세스 토큰',
  })
  accessToken: string;

  @Field(() => String, {
    description: 'JWT 리프레시 토큰',
  })
  refreshToken: string;
}
