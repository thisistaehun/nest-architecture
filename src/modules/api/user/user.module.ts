import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/infrastructure/auth/auth.module';
import { User } from './entities/user.entity';
import { EmailLoginUsecase } from './usecase/login.usecase';
import { SignUpUsecase } from './usecase/sign-up.usecase';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    SignUpUsecase,
    EmailLoginUsecase,
  ],
})
export class UserModule {}
