import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/modules/infrastructure/auth/decorator/public.decorator';
import { SignUpInput } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { SignUpUsecase } from './usecase/sign-up.usecase';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly singUpUsecase: SignUpUsecase,
  ) {}

  @Public()
  @Mutation(() => User)
  signUp(@Args('input') input: SignUpInput): Promise<User> {
    return this.singUpUsecase.execute(input);
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }
}
