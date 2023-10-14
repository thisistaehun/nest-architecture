import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { Public } from 'src/modules/infrastructure/auth/decorator/public.decorator';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { SignUpInput, SignUpOutput } from './dtos/sign-up.dto';
import { User } from './entities/user.entity';
import { EmailLoginUsecase } from './usecase/login.usecase';
import { SignUpUsecase } from './usecase/sign-up.usecase';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly singUpUsecase: SignUpUsecase,
    private readonly emailLoginUsecase: EmailLoginUsecase,
  ) {}

  @Public()
  @Mutation(() => SignUpOutput, {
    description: '회원가입을 합니다.',
  })
  signUp(@Args('input') input: SignUpInput): Promise<SignUpOutput> {
    return this.singUpUsecase.execute(input);
  }

  @Public()
  @Mutation(() => LoginOutput, {
    description: '이메일로 로그인 합니다.',
  })
  emailLogin(@Args('input') input: LoginInput): Promise<LoginOutput> {
    return this.emailLoginUsecase.execute(input);
  }

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
