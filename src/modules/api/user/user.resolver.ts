import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { Public } from 'src/modules/infrastructure/auth/decorator/public.decorator';

import { EmailLoginInput } from './dtos/login/input/email-login.input';
import { SocialLoginInput } from './dtos/login/input/social-login.input';
import { LoginOutput } from './dtos/login/output/login.output';
import { SocialLoginOutput } from './dtos/login/output/social-login.output';
import { EmailSignUpInput } from './dtos/sign-up/input/email.sign-up.input';
import { SignUpOutput } from './dtos/sign-up/sign-up.dto';
import { VerificationInput } from './dtos/verification/verification.input';
import { WithdrawInput } from './dtos/withdraw/input/withdraw.input';
import { WithdrawOutput } from './dtos/withdraw/output/withdraw.output';
import { User } from './entities/user.entity';
import { UserAuth } from './type/user.auth.type';
import { EmailLoginUsecase } from './usecase/login/email/email-login';
import { EmailSignUpUsecase } from './usecase/login/email/email-sign-up.usecase';
import { SocialLoginUsecase } from './usecase/login/social/social-login.usecase';
import { SendMessageForVerificationUsecase } from './usecase/verification/send-message-for-verification.usecase';
import { VerficationUsecase } from './usecase/verification/verification.usecase';
import { SendMessageForWithdrawUsecase } from './usecase/withdraw/send-message-for-withdraw.usecase';
import { WithdrawUsecase } from './usecase/withdraw/withdraw.usecase';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly singUpUsecase: EmailSignUpUsecase,
    private readonly emailLoginUsecase: EmailLoginUsecase,
    private readonly socialLoginUsecase: SocialLoginUsecase,
    private readonly sendMessageForWithdrawUsecase: SendMessageForWithdrawUsecase,
    private readonly sendMessageForVerificationUsecase: SendMessageForVerificationUsecase,
    private readonly withdrawUsecase: WithdrawUsecase,
    private readonly verificationUsecase: VerficationUsecase,
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
    description: '소셜 로그인(가입 포함) 합니다.',
  })
  socialLogin(
    @Args('input') input: SocialLoginInput,
  ): Promise<SocialLoginOutput> {
    return this.socialLoginUsecase.execute(input);
  }

  @Mutation(() => Boolean, {
    description: '가입 후 본인인증을 위해 인증 코드를 전송합니다.',
  })
  sendMessageForVerification(
    @CurrentUser() userAuth: UserAuth,
    @Args('phoneNumber') phoneNumber: string,
  ): Promise<boolean> {
    return this.sendMessageForVerificationUsecase.execute(
      userAuth,
      phoneNumber,
    );
  }

  @Mutation(() => User, {
    description:
      '가입 후 본인인증을 위해, 휴대폰으로 전송된 인증번호로 본인인증 및 전화번호 등록을 완료합니다.',
  })
  verification(
    @CurrentUser() userAuth: UserAuth,
    @Args('input') input: VerificationInput,
  ): Promise<User> {
    return this.verificationUsecase.execute(userAuth, input);
  }

  @Mutation(() => Boolean, {
    description: '회원탈퇴를 위해 인증 코드를 저장합니다.',
  })
  sendMessageForWithdraw(@CurrentUser() user: UserAuth): Promise<boolean> {
    return this.sendMessageForWithdrawUsecase.execute(user);
  }

  @Mutation(() => WithdrawOutput, {
    description: '인증코드를 확인하여 회원탈퇴를 합니다.',
  })
  withdraw(@CurrentUser() user: UserAuth, @Args('input') input: WithdrawInput) {
    return this.withdrawUsecase.execute(input, user);
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
