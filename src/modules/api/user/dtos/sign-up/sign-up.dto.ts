import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';

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
