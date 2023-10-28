import { Field } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PointTransaction } from './point-transaction.entity';

@Entity({ name: 'total_point' })
export class TotalPoint extends CommonEntity {
  @Field(() => Number, { description: '무료 포인트 잔액' })
  @Column({ name: 'free_point', type: 'bigint', default: 0 })
  freePoint: number;

  @Field(() => Number, { description: '유료 포인트 잔액' })
  @Column({ name: 'paid_point', type: 'bigint', default: 0 })
  paidPoint: number;

  @OneToOne(() => User, (user: User) => user.point, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => PointTransaction,
    (pointTransaction: PointTransaction) => pointTransaction.totalPoint,
  )
  pointTransactions: PointTransaction[];
}
