import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilModule } from 'src/modules/common/util/util.module';
import { AuthModule } from 'src/modules/infrastructure/auth/auth.module';
import { AwsModule } from 'src/modules/infrastructure/aws/aws.module';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { RedisModule } from 'src/modules/infrastructure/redis/redis.module';
import {
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../symbols';
import { TotalPoint } from '../point/entities/total-point.entity';
import { User } from './entities/user.entity';
import { UserCommandRepository } from './repository/command/user.command.repository';
import { UserQueryRepository } from './repository/query/user.query.repository';
import { UserMutationResolver } from './resolver/mutation/user.mutation.resolver';
import { UserResolver as UserQueryResolver } from './resolver/query/user.query.resolver';
import { UserService } from './service/user.service';
import { EmailLoginUsecase } from './usecase/login/email/email-login.usecase';
import { EmailSignUpUsecase } from './usecase/login/email/email-sign-up.usecase';
import { SocialLoginUsecase } from './usecase/login/social/social-login.usecase';
import { SocialProfileProvider } from './usecase/login/social/social-profile.provider';
import { CheckDuplicatedNicknameUsecase } from './usecase/update/check.duplicated-nickname.usecase';
import { UpdateUserUsecase } from './usecase/update/update-user.usecase';
import { SendMessageForVerificationUsecase } from './usecase/verification/send-message-for-verification.usecase';
import { VerficationUsecase } from './usecase/verification/verification.usecase';
import { SendMessageForWithdrawUsecase } from './usecase/withdraw/send-message-for-withdraw.usecase';
import { WithdrawUsecase } from './usecase/withdraw/withdraw.usecase';

@Module({
  imports: [
    UtilModule,
    TypeOrmModule.forFeature([User, TotalPoint]),
    AuthModule,
    AwsModule,
    RedisModule.register({
      host: envVariables.REDIS_HOST,
      port: envVariables.REDIS_PORT,
      password: envVariables.REDIS_PASSWORD,
    }),
  ],
  providers: [
    // Repositories
    {
      provide: USER_COMMAND_REPOSITORY,
      useClass: UserCommandRepository,
    },
    {
      provide: USER_QUERY_REPOSITORY,
      useClass: UserQueryRepository,
    },
    // Usecases
    EmailSignUpUsecase,
    EmailLoginUsecase,
    SocialLoginUsecase,
    SendMessageForVerificationUsecase,
    SendMessageForWithdrawUsecase,
    WithdrawUsecase,
    VerficationUsecase,
    UpdateUserUsecase,
    CheckDuplicatedNicknameUsecase,
    // Providers
    SocialProfileProvider,
    // Services
    UserService,
    // Resolvers
    UserQueryResolver,
    UserMutationResolver,
  ],
})
export class UserModule {}
