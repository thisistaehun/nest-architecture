import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtAuthService } from 'src/modules/infrastructure/auth/service/jwt.auth.service';
import { LoginInput, LoginOutput } from '../dtos/login.dto';
import { UserRepository } from '../user.repository';

@Injectable()
export class EmailLoginUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const savedUser = await this.userRepository.findOneByEmail(input.email);
    const passwordConfirmation = bcrypt.compare(
      input.password,
      savedUser.password,
    );
    if (!passwordConfirmation) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = this.jwtAuthService.createAccessToken(savedUser);
    const refreshToken = this.jwtAuthService.createRefreshToken(savedUser.code);

    return {
      accessToken,
      refreshToken,
    };
  }
}
