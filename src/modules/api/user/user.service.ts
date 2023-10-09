import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserInput: CreateUserInput) {
    const user = this.userRepository.create(createUserInput);
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findOneById(id);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }
}
