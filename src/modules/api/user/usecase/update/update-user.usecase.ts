import { Inject, Injectable } from '@nestjs/common';
import { IUsecase } from 'src/interface/usecase/usecase.interface';
import {
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../../../symbols';
import { UserCommandRepository } from '../../cqrs/command/user.command.repository';
import { UserQueryRepository } from '../../cqrs/query/user.query.repository';
import { UpdateUserInput } from '../../dtos/update/update-user.dto';
import { User } from '../../entities/user.entity';
import { UserAuth } from '../../type/user.auth.type';

@Injectable()
export class UpdateUserUsecase implements IUsecase<UserAuth, UpdateUserInput> {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userRepository: UserQueryRepository,
    @Inject(USER_COMMAND_REPOSITORY)
    private readonly userCommandRepository: UserCommandRepository,
  ) {}

  public async execute(
    userAuth: UserAuth,
    input: UpdateUserInput,
  ): Promise<User> {
    return this.userCommandRepository.update(userAuth.code, input);
  }
}
