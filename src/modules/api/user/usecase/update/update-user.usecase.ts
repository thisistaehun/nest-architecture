import { Injectable } from '@nestjs/common';
import { UpdateUserInput } from '../../dtos/update/update-user.dto';
import { UserAuth } from '../../type/user.auth.type';
import { UserRepository } from '../../user.repository';

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(userAuth: UserAuth, input: UpdateUserInput) {
    return this.userRepository.update(userAuth.code, input);
  }
}
