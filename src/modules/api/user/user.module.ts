import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilModule } from 'src/modules/common/util/util.module';
import { AuthModule } from 'src/modules/infrastructure/auth/auth.module';
import { AwsModule } from 'src/modules/infrastructure/aws/aws.module';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { RedisModule } from 'src/modules/infrastructure/redis/redis.module';
import { User } from './entities/user.entity';
import { EmailLoginUsecase } from './usecase/login/email/email-login';
import { EmailSignUpUsecase } from './usecase/login/email/email-sign-up.usecase';
import { SocialLoginUsecase } from './usecase/login/social/social-login.usecase';
import { SocialProfileProvider } from './usecase/login/social/social-profile.provider';
import { UpdateUserUsecase } from './usecase/update/update-user.usecase';
import { SendMessageForVerificationUsecase } from './usecase/verification/send-message-for-verification.usecase';
import { VerficationUsecase } from './usecase/verification/verification.usecase';
import { SendMessageForWithdrawUsecase } from './usecase/withdraw/send-message-for-withdraw.usecase';
import { WithdrawUsecase } from './usecase/withdraw/withdraw.usecase';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    UtilModule,
    TypeOrmModule.forFeature([User]),
    AuthModule,
    AwsModule,
    RedisModule.register({
      host: envVariables.REDIS_HOST,
      port: envVariables.REDIS_PORT,
      password: envVariables.REDIS_PASSWORD,
    }),
  ],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    EmailSignUpUsecase,
    EmailLoginUsecase,
    SocialLoginUsecase,
    SendMessageForVerificationUsecase,
    SendMessageForWithdrawUsecase,
    WithdrawUsecase,
    VerficationUsecase,
    SocialProfileProvider,
    UpdateUserUsecase,
  ],
})
export class UserModule {}
