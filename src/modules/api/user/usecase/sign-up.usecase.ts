import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpInput } from '../dtos/create-user.dto';
import { UserRepository } from '../user.repository';

@Injectable()
export class SignUpUsecase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(input: SignUpInput) {
    const checkEmailExist = await this.userRepository.findOneByEmail(
      input.email,
    );
    if (checkEmailExist) {
      throw new Error('이미 존재하는 이메일입니다.');
    }
    const checkNicknameExist = await this.userRepository.findOneByNickname(
      input.nickname,
    );

    if (checkNicknameExist) {
      throw new Error('이미 존재하는 닉네임입니다.');
    }

    const hashPassword = await bcrypt.hash(input.password, 10);
    input.password = hashPassword;
    const user = this.userRepository.create(input);
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}
