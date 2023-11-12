import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { Public } from 'src/modules/infrastructure/auth/decorator/public.decorator';
import { Roles } from 'src/modules/infrastructure/auth/decorator/roles.decorator';
import { EmailLoginInput } from '../../dto/login/input/email-login.input';
import { SocialLoginInput } from '../../dto/login/input/social-login.input';
import { LoginOutput } from '../../dto/login/output/login.output';
import { SocialLoginOutput } from '../../dto/login/output/social-login.output';
import { EmailSignUpInput } from '../../dto/sign-up/input/email.sign-up.input';
import { SignUpOutput } from '../../dto/sign-up/sign-up.dto';
import { UpdateUserInput } from '../../dto/update/input/update-user.dto';
import { VerificationInput } from '../../dto/verification/input/verification.input';
import { CheckDuplicatedNicknameOutput } from '../../dto/verification/output/check.duplicated-nickname.output';
import { WithdrawInput } from '../../dto/withdraw/input/withdraw.input';
import { WithdrawOutput } from '../../dto/withdraw/output/withdraw.output';
import { User } from '../../entities/user.entity';
import { UserAuth } from '../../type/user.auth.type';
import { UserRole } from '../../type/user.role';
import { EmailLoginUsecase } from '../../usecase/login/email/email-login.usecase';
import { EmailSignUpUsecase } from '../../usecase/login/email/email-sign-up.usecase';
import { SocialLoginUsecase } from '../../usecase/login/social/social-login.usecase';
import { CheckDuplicatedNicknameUsecase } from '../../usecase/update/check.duplicated-nickname.usecase';
import { UpdateUserUsecase } from '../../usecase/update/update-user.usecase';
import { GetAuthorizedTokenUsecase } from '../../usecase/verification/get-authorized-token.usecase';
import { SendMessageForVerificationUsecase } from '../../usecase/verification/send-message-for-verification.usecase';
import { VerficationUsecase } from '../../usecase/verification/verification.usecase';
import { SendMessageForWithdrawUsecase } from '../../usecase/withdraw/send-message-for-withdraw.usecase';
import { WithdrawUsecase } from '../../usecase/withdraw/withdraw.usecase';

@Resolver()
export class UserMutationResolver {
  constructor(
    private readonly singUpUsecase: EmailSignUpUsecase,
    private readonly emailLoginUsecase: EmailLoginUsecase,
    private readonly socialLoginUsecase: SocialLoginUsecase,
    private readonly sendMessageForWithdrawUsecase: SendMessageForWithdrawUsecase,
    private readonly sendMessageForVerificationUsecase: SendMessageForVerificationUsecase,
    private readonly withdrawUsecase: WithdrawUsecase,
    private readonly verificationUsecase: VerficationUsecase,
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly checkDuplicatedNicknameUsecase: CheckDuplicatedNicknameUsecase,
    private readonly getAuthorizedTokenUsecase: GetAuthorizedTokenUsecase,
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

  @Roles(UserRole.UNAUTH_USER)
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

  @Roles(UserRole.UNAUTH_USER)
  @Mutation(() => User, {
    description:
      '가입 후 본인인증을 위해, 휴대폰으로 전송된 인증번호로 본인인증 및 전화번호 등록을 완료합니다.',
  })
  verification(
    @CurrentUser() userAuth: UserAuth,
    @Args('input') input: VerificationInput,
  ): Promise<User> {
    return this.verificationUsecase.execute(input, userAuth);
  }

  @Roles(UserRole.FREE_USER)
  @Mutation(() => Boolean, {
    description: '회원탈퇴를 위해 인증 코드를 저장합니다.',
  })
  sendMessageForWithdraw(@CurrentUser() user: UserAuth): Promise<boolean> {
    return this.sendMessageForWithdrawUsecase.execute(user);
  }

  @Roles(UserRole.FREE_USER)
  @Mutation(() => WithdrawOutput, {
    description: '인증코드를 확인하여 회원탈퇴를 합니다.',
  })
  withdraw(@CurrentUser() user: UserAuth, @Args('input') input: WithdrawInput) {
    return this.withdrawUsecase.execute(input, user);
  }

  @Roles(UserRole.UNAUTH_USER)
  @Mutation(() => User, {
    description: '회원정보를 수정합니다.',
  })
  update(@CurrentUser() user: UserAuth, @Args('input') input: UpdateUserInput) {
    return this.updateUserUsecase.execute(user, input);
  }

  @Roles(UserRole.UNAUTH_USER)
  @Mutation(() => CheckDuplicatedNicknameOutput, {
    description: '닉네임 중복을 확인합니다.',
  })
  checkDuplicatedNickname(@Args('nickname') nickname: string) {
    return this.checkDuplicatedNicknameUsecase.execute(nickname);
  }

  @Roles(UserRole.UNAUTH_USER)
  @Mutation(() => String, {
    description: '인증된 토큰을 발급합니다.',
  })
  async getAuthorizedAccessToken(@CurrentUser() user: UserAuth) {
    return this.getAuthorizedTokenUsecase.execute(user);
  }
}
