import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { Public } from 'src/modules/infrastructure/auth/decorator/public.decorator';

import { EmailLoginInput } from './dtos/login/input/email-login.input';
import { SocialLoginInput } from './dtos/login/input/social-login.input';
import { LoginOutput } from './dtos/login/output/login.output';
import { SocialLoginOutput } from './dtos/login/output/social-login.output';
import { EmailSignUpInput } from './dtos/sign-up/input/email.sign-up.input';
import { SignUpOutput } from './dtos/sign-up/sign-up.dto';
import { User } from './entities/user.entity';
import { EmailLoginUsecase } from './usecase/email-login';
import { EmailSignUpUsecase } from './usecase/email-sign-up.usecase';
import { SocialLoginUsecase } from './usecase/social-login.usecase';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly singUpUsecase: EmailSignUpUsecase,
    private readonly emailLoginUsecase: EmailLoginUsecase,
    private readonly socialLoginUsecase: SocialLoginUsecase,
  ) {}

  @Public()
  @Mutation(() => SignUpOutput, {
    description: '회원가입을 합니다.',
  })
  signUp(@Args('input') input: EmailSignUpInput): Promise<SignUpOutput> {
    return this.singUpUsecase.execute(input);
  }

  @Public()
  @Mutation(() => LoginOutput, {
    description: '이메일로 로그인 합니다.',
  })
  emailLogin(@Args('input') input: EmailLoginInput): Promise<LoginOutput> {
    return this.emailLoginUsecase.execute(input);
  }

  @Public()
  @Mutation(() => SocialLoginOutput, {
    description: '소셜 로그인 합니다.',
  })
  socialLogin(
    @Args('input') input: SocialLoginInput,
  ): Promise<SocialLoginOutput> {
    return this.socialLoginUsecase.execute(input);
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
