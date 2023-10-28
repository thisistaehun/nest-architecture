import { ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PointTransactionType } from '../type/point.transaction.type';
import { PointType } from '../type/point.type';
import { TotalPoint } from './total-point.entity';

@Entity({ name: 'point_transaction' })
@ObjectType({ description: 'Point' })
export class PointTransaction extends CommonEntity {
  @Column({ name: 'amount', type: 'bigint' })
  amount: number;

  @Column({ name: 'type', type: 'varchar', length: 45 })
  type: PointType;

  @Column({ name: 'transaction_type', type: 'varchar', length: 45 })
  transactionType: PointTransactionType;

  @ManyToOne(() => TotalPoint, (point: TotalPoint) => point.pointTransactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'point_id' })
  totalPoint: TotalPoint;
}
