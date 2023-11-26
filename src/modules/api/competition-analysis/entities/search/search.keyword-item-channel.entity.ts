import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SearchKeywordItem } from './search.keyword-item.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item_channel' })
export class SearchKeywordItemChannel extends CommonBulkEntity {
  @Field(() => String, { nullable: true })
  @Column({ name: 'highlight', type: 'text', nullable: true })
  highlight: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'url', type: 'varchar', length: 1000, nullable: true })
  url: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'title', type: 'text', nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'description', type: 'text', nullable: true })
  serviceType: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'service_id', type: 'text', nullable: true })
  serviceId: string;

  @ManyToOne(
    () => SearchKeywordItem,
    (keywordItem) => keywordItem.channel,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'keyword_item_id' })
  keywordItem: SearchKeywordItem;

  constructor(partial: Partial<SearchKeywordItemChannel>) {
    super();
    Object.assign(this, partial);
  }
}
