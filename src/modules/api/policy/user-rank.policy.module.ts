import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRankPolicy } from './entities/user-rank.policy.entity';
import { UserRankResolver as UserRankPolicyResolver } from './entities/user-rank.resolver';
import { CreateUserRankPolicyUsecase } from './usecase/create.user-rank.policy.usecase';
import { UserRankPolicyReflector } from './user-rank.policy.reflector';
import { UserRankPolicyRepository } from './user-rank.policy.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRankPolicy])],
  providers: [
    UserRankPolicyReflector,
    UserRankPolicyRepository,
    UserRankPolicyResolver,
    CreateUserRankPolicyUsecase,
  ],
  exports: [UserRankPolicyReflector, UserRankPolicyRepository],
})
export class UserRankPolicyModule {}
