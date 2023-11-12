import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';

import { Roles } from 'src/modules/infrastructure/auth/decorator/roles.decorator';
import { User } from '../../entities/user.entity';
import { UserService } from '../../service/user.service';
import { UserAuth } from '../../type/user.auth.type';
import { UserRole } from '../../type/user.role';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.ADMIN)
  @Query(() => [User], {
    name: 'users',
    description: '모든 유저를 가져옵니다.',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Roles(UserRole.UNAUTH_USER)
  @Query(() => User, {
    name: 'user',
    description: '유저가 내 정보를 불러옵니다.',
  })
  findOne(@CurrentUser() user: UserAuth) {
    return this.userService.findOneByEmail(user.email);
  }
}
