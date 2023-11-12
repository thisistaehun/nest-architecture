import { Module } from '@nestjs/common';
import { UserRankPolicyReflector } from './user-rank.policy.reflector';
import { UserRankPolicyRepository } from './user-rank.policy.repository';

@Module({
  providers: [UserRankPolicyReflector, UserRankPolicyRepository],
  exports: [UserRankPolicyReflector, UserRankPolicyRepository],
})
export class UserRankPolicyModule {}
