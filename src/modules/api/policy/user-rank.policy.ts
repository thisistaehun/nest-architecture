import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_rank_policy' })
@ObjectType()
export class UserRankPolicy extends CommonEntity {
  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  @Field(() => Number, {
    description: '입문자 기준 충전 금액',
  })
  beginnerChargeAmount: number;

  @Field(() => Number, {
    description: '초심자 기준 충전 금액',
  })
  amateurChargeAmount: number;

  @Field(() => Number, {
    description: '중급자 기준 충전 금액',
  })
  intermediateChargeAmount: number;

  @Field(() => Number, {
    description: '고급자 기준 충전 금액',
  })
  advancedChargeAmount: number;

  @Field(() => Number, {
    description: '전문가 기준 충전 금액',
  })
  expertChargeAmount: number;
}
