import { Inject, Injectable } from '@nestjs/common';
import { USER_QUERY_REPOSITORY } from 'src/symbols';
import { JwtAuthService } from '../../../../infrastructure/auth/service/jwt.auth.service';
import { UserQueryRepository } from '../../repository/query/user.query.repository';
import { UserAuth } from '../../type/user.auth.type';
import { UserRank } from '../../type/user.rank.type';
import { UserRole } from '../../type/user.role';

@Injectable()
export class GetAuthorizedTokenUsecase {
  constructor(
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userQueryRepository: UserQueryRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async execute(userAuth: UserAuth): Promise<string> {
    const user = await this.userQueryRepository.findOneByEmail(userAuth.email);
    if (
      user.role === UserRole.UNAUTH_USER ||
      user.rank === UserRank.UNAUTH ||
      !user.nickname
    ) {
      throw new Error(
        '전화번호 인증 및 닉네임 변경 후 토큰 발급을 진행해주세요.',
      );
    }
    return this.jwtAuthService.createAccessToken(user);
  }
}
