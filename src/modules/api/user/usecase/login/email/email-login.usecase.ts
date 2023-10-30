import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BadRequestCustomException } from 'src/modules/common/exception/bad-request.exception';
import { JwtAuthService } from 'src/modules/infrastructure/auth/service/jwt.auth.service';
import { USER_QUERY_REPOSITORY } from '../../../../../../symbols';
import { EmailLoginInput } from '../../../dto/login/input/email-login.input';
import { LoginOutput } from '../../../dto/login/output/login.output';
import { UserQueryRepository } from '../../../repository/query/user.query.repository';

@Injectable()
export class EmailLoginUsecase {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async execute(input: EmailLoginInput): Promise<LoginOutput> {
    const savedUser = await this.userRepository.findOneByEmail(input.email);
    const passwordConfirmation = bcrypt.compare(
      input.password,
      savedUser.password,
    );
    if (!passwordConfirmation) {
      throw new BadRequestCustomException('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = this.jwtAuthService.createAccessToken(savedUser);
    const refreshToken = this.jwtAuthService.createRefreshToken(savedUser.code);

    return {
      accessToken,
      refreshToken,
      user: savedUser,
    };
  }
}
