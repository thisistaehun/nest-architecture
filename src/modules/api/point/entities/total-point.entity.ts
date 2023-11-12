import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PointTransaction } from './point-transaction.entity';

@Entity({ name: 'user_wallet' })
@ObjectType({
  description: '포인트 잔액',
})
export class UserWallet extends CommonEntity {
  @Field(() => Number, { description: '무료 포인트 잔액' })
  @Column({ name: 'free_point', type: 'bigint', default: 0 })
  freePoint: number;

  @Field(() => Number, { description: '유료 포인트 잔액' })
  @Column({ name: 'paid_point', type: 'bigint', default: 0 })
  paidPoint: number;

  @Field(() => Number, { description: '누적 충전 금액' })
  @Column({ name: 'cumulative_charged', type: 'bigint', default: 0 })
  cumulativeCharged: number;

  @OneToOne(() => User, (user: User) => user.userWallet, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { description: '사용자' })
  user: User;

  @OneToMany(
    () => PointTransaction,
    (pointTransaction: PointTransaction) => pointTransaction.totalPoint,
  )
  @Field(() => [PointTransaction], { description: '포인트 거래 내역' })
  pointTransactions: PointTransaction[];
}
