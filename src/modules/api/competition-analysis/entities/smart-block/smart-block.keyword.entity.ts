import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class SmartBlockKeyword extends CommonBulkEntity {
  @Field(() => Number, { nullable: true })
  @Column({ type: 'int', nullable: true })
  count: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  bid: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  desc: string;
}
