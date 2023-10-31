import { Inject, Injectable } from '@nestjs/common';
import { USER_QUERY_REPOSITORY } from 'src/symbols';
import { CheckDuplicatedNicknameOutput } from '../../dto/verification/output/check.duplicated-nickname.output';
import { UserQueryRepository } from '../../repository/query/user.query.repository';

@Injectable()
export class CheckDuplicatedNicknameUsecase {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userQueryRepository: UserQueryRepository,
  ) {}
  public async execute(
    nickname: string,
  ): Promise<CheckDuplicatedNicknameOutput> {
    if (!nickname) {
      return {
        valid: false,
        message: '닉네임을 입력해주세요.',
      };
    }
    const user = await this.userQueryRepository.findOneByNickname(nickname);
    if (user) {
      return {
        valid: false,
        message: '이미 존재하는 닉네임입니다.',
      };
    }
    return {
      valid: true,
      message: '사용 가능한 닉네임입니다.',
    };
  }
}
