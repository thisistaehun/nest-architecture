import { InputType, PickType } from '@nestjs/graphql';
import { UserRankPolicy } from '../entities/user-rank.policy.entity';

@InputType()
export class CreateUserRankPolicyInput extends PickType(UserRankPolicy, [
  'expertChargeAmount',
  'advancedChargeAmount',
  'intermediateChargeAmount',
  'amateurChargeAmount',
  'beginnerChargeAmount',
]) {}
