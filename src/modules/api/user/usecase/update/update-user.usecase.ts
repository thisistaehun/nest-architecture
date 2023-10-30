import { Inject, Injectable } from '@nestjs/common';
import { IUsecase } from 'src/interface/usecase/usecase.interface';
import { ConflictCustomException } from 'src/modules/common/exception/conflict.exception';
import {
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from '../../../../../symbols';
import { UpdateUserInput } from '../../dto/update/input/update-user.dto';
import { User } from '../../entities/user.entity';
import { UserCommandRepository } from '../../repository/command/user.command.repository';
import { UserQueryRepository } from '../../repository/query/user.query.repository';
import { UserAuth } from '../../type/user.auth.type';

@Injectable()
export class UpdateUserUsecase implements IUsecase<UserAuth, UpdateUserInput> {
  constructor(
    @Inject(USER_COMMAND_REPOSITORY)
    private readonly userCommandRepository: UserCommandRepository,
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  public async execute(
    userAuth: UserAuth,
    input: UpdateUserInput,
  ): Promise<User> {
    await this.checkDuplicatedNickname(input.nickname);
    return this.userCommandRepository.update(userAuth.code, input);
  }

  private async checkDuplicatedNickname(nickname: string): Promise<void> {
    const user = await this.userQueryRepository.findOneByNickname(nickname);
    if (user) {
      throw new ConflictCustomException('이미 존재하는 닉네임입니다.');
    }
  }
}
