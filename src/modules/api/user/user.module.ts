import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/infrastructure/auth/auth.module';
import { User } from './entities/user.entity';
import { EmailLoginUsecase } from './usecase/email-login';
import { EmailSignUpUsecase } from './usecase/email-sign-up.usecase';
import { SocialLoginUsecase } from './usecase/social-login.usecase';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    EmailSignUpUsecase,
    EmailLoginUsecase,
    SocialLoginUsecase,
  ],
})
export class UserModule {}
