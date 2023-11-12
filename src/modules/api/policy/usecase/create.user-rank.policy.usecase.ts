import { Injectable } from '@nestjs/common';
import { CreateUserRankPolicyInput } from '../dto/create.user-rank.policy.input';
import { UserRankPolicy } from '../entities/user-rank.policy.entity';
import { UserRankPolicyRepository } from '../user-rank.policy.repository';

@Injectable()
export class CreateUserRankPolicyUsecase {
  constructor(
    private readonly userRankPolicyRepository: UserRankPolicyRepository,
  ) {}
  async execute(input: CreateUserRankPolicyInput): Promise<UserRankPolicy> {
    this.validatePolicy(input);
    const userRankPolicy = this.userRankPolicyRepository.create(input);
    const savedResult = await this.userRankPolicyRepository.save(
      userRankPolicy,
    );

    return savedResult;
  }

  private validatePolicy(input: CreateUserRankPolicyInput): void {
    if (input.expertChargeAmount < input.advancedChargeAmount) {
      throw new Error('전문가의 기준은 고급보다 커야 합니다.');
    }
    if (input.advancedChargeAmount < input.intermediateChargeAmount) {
      throw new Error('고급자의 기준은 중급보다 커야 합니다.');
    }
    if (input.intermediateChargeAmount < input.amateurChargeAmount) {
      throw new Error('중급자의 기준은 초급보다 커야 합니다.');
    }
    if (input.amateurChargeAmount < input.beginnerChargeAmount) {
      throw new Error('초급자의 기준은 0보다 커야 합니다.');
    }
    if (input.beginnerChargeAmount < 0) {
      throw new Error('초급자의 기준은 0보다 커야 합니다.');
    }
  }
}
