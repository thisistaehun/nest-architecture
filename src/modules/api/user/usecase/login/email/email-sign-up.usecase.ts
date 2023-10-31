import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUsecase } from 'src/interface/usecase/usecase.interface';
import { BadRequestCustomException } from 'src/modules/common/exception/bad-request.exception';
import { JwtAuthService } from 'src/modules/infrastructure/auth/service/jwt.auth.service';
import {
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../../../../symbols';
import { EmailSignUpInput } from '../../../dto/sign-up/input/email.sign-up.input';
import { SignUpOutput } from '../../../dto/sign-up/sign-up.dto';
import { UserCommandRepository } from '../../../repository/command/user.command.repository';
import { UserQueryRepository } from '../../../repository/query/user.query.repository';

@Injectable()
export class EmailSignUpUsecase
  implements IUsecase<EmailSignUpInput, SignUpOutput>
{
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    private readonly jwtAuthService: JwtAuthService,
    @Inject(USER_COMMAND_REPOSITORY)
    private readonly userCommandRepository: UserCommandRepository,
  ) {}
  async execute(input: EmailSignUpInput): Promise<SignUpOutput> {
    this.passwordValidation(input);

    const hashPassword = await bcrypt.hash(input.password, 10);
    input.password = hashPassword;
    const savedUser = await this.userCommandRepository.signUpTransaction(input);
    const accessToken = this.jwtAuthService.createAccessToken(savedUser);
    const refreshToken = this.jwtAuthService.createRefreshToken(savedUser.code);

    return {
      user: savedUser,
      accessToken,
      refreshToken,
    };
  }

  private passwordValidation(input: EmailSignUpInput) {
    if (input.password !== input.repassword) {
      throw new BadRequestCustomException('비밀번호가 일치하지 않습니다.');
    }

    if (input.password.length < 8) {
      throw new BadRequestCustomException(
        '비밀번호는 8자리 이상이어야 합니다.',
      );
    }
  }
}
