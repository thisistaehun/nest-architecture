import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../entities/user.entity';

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

  @Field(() => User, {
    description: '로그인한 유저',
  })
  user: User;
}
