import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserRankPolicyInput } from '../dto/create.user-rank.policy.input';
import { CreateUserRankPolicyUsecase } from '../usecase/create.user-rank.policy.usecase';
import { UserRankPolicy } from './user-rank.policy.entity';

@Resolver()
export class UserRankResolver {
  constructor(
    private readonly createUserRankPolicyUsecase: CreateUserRankPolicyUsecase,
  ) {}
  @Mutation(() => UserRankPolicy, {
    description: '사용자 등급 정책을 추가합니다.',
  })
  async createUserRankPolicy(
    @Args('input') input: CreateUserRankPolicyInput,
  ): Promise<UserRankPolicy> {
    return this.createUserRankPolicyUsecase.execute(input);
  }
}
