import { Inject, Injectable } from '@nestjs/common';
import { USER_QUERY_REPOSITORY } from '../../../../symbols';
import { UserQueryRepository } from '../repository/query/user.query.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
  ) {}

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
