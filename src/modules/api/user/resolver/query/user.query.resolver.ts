import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';

import { User } from '../../entities/user.entity';
import { UserService } from '../../service/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], {
    name: 'users',
    description: '모든 유저를 가져옵니다.',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, {
    name: 'user',
    description: '유저가 내 정보를 불러옵니다.',
  })
  findOne(@CurrentUser() user: User) {
    return this.userService.findOne(user.id);
  }
}
