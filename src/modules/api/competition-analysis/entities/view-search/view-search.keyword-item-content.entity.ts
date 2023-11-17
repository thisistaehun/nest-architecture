import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { ViewSearchKeywordItemContentTag } from './view-search.keyword-item.content.tag.entity';
import { ViewSearchKeywordItem } from './view-search.keyword-item.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item_content' })
export class ViewSearchKeywordItemContent extends CommonBulkEntity {
  @Field(() => Number, { nullable: true })
  crRank: number;

  @Field(() => String, { nullable: true })
  crArea: string;

  @Field(() => String, { nullable: true })
  crGdid: string;

  @Field(() => String, { nullable: true })
  slogContent: string;

  @Field(() => String, { nullable: true })
  crScoreA: number;

  @Field(() => Number, { nullable: true })
  crScoreB: number;

  @Field(() => Number, { nullable: true })
  crScoreC: number;

  @Field(() => Number, { nullable: true })
  crScoreD: number;

  @Field(() => String, { nullable: true })
  url: string;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Number, { nullable: true })
  mediaCount: number;

  @Field(() => String, { nullable: true })
  createdAt: string;

  @Field(() => [ViewSearchKeywordItemContentTag])
  tags: ViewSearchKeywordItemContentTag[];

  @Field(() => String)
  serviceType: string;

  @Field(() => String)
  serviceId: string;

  @Field(() => String)
  contentId: string;

  @OneToOne(() => ViewSearchKeywordItem, (keywordItem) => keywordItem.content)
  @JoinColumn({ name: 'keyword_item_id' })
  keywordItem: ViewSearchKeywordItem;
}
