import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtAuthService } from 'src/modules/infrastructure/auth/service/jwt.auth.service';
import { SignUpInput, SignUpOutput } from '../dtos/sign-up.dto';
import { UserRepository } from '../user.repository';

@Injectable()
export class SignUpUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}
  async execute(input: SignUpInput): Promise<SignUpOutput> {
    this.passwordValidation(input);
    await this.checkDuplicated(input);

    const hashPassword = await bcrypt.hash(input.password, 10);
    input.password = hashPassword;
    const user = this.userRepository.create(input);
    const savedUser = await this.userRepository.save(user);
    const accessToken = this.jwtAuthService.createAccessToken(savedUser);
    const refreshToken = this.jwtAuthService.createRefreshToken(savedUser.code);

    console.log(accessToken, refreshToken);
    console.log(savedUser);
    return {
      user: savedUser,
      accessToken,
      refreshToken,
    };
  }

  private passwordValidation(input: SignUpInput) {
    if (input.password !== input.repassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    if (input.password.length < 8) {
      throw new Error('비밀번호는 8자리 이상이어야 합니다.');
    }
  }

  private async checkDuplicated(input: SignUpInput): Promise<void> {
    const [checkEmailExist, checkNicknameExist] = await Promise.all([
      this.userRepository.findOneByEmail(input.email),
      this.userRepository.findOneByNickname(input.nickname),
    ]);

    if (checkEmailExist) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    if (checkNicknameExist) {
      throw new Error('이미 존재하는 닉네임입니다.');
    }
  }
}