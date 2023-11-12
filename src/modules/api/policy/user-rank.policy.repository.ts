import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRankPolicy } from './user-rank.policy.entity';

@Injectable()
export class UserRankPolicyRepository {
  constructor(
    @InjectRepository(UserRankPolicy)
    private readonly userRankPolicyRepository: Repository<UserRankPolicy>,
  ) {}

  create(userRankPolicy: Partial<UserRankPolicy>): UserRankPolicy {
    return this.userRankPolicyRepository.create(userRankPolicy);
  }

  async save(userRankPolicy: UserRankPolicy): Promise<UserRankPolicy> {
    return this.userRankPolicyRepository.save(userRankPolicy);
  }

  async findOneByCode(code: string): Promise<UserRankPolicy> {
    return this.userRankPolicyRepository.findOne({
      where: {
        code,
      },
    });
  }
}
