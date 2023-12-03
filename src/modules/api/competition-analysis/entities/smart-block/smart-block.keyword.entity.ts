import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SearchKeyword } from '../keyword/keyword.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'smart_block_keyword' })
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

  @ManyToOne(() => SearchKeyword, (keyword) => keyword.smartBlockKeywords)
  @JoinColumn({ name: 'keyword_id' })
  keyword: SearchKeyword;

  constructor(partial: Partial<SmartBlockKeyword>) {
    super();
    Object.assign(this, partial);
  }
}
