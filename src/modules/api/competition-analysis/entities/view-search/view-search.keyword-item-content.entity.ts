import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ViewSearchKeywordItemContentTag } from './view-search.keyword-item.content.tag.entity';
import { ViewSearchKeywordItem } from './view-search.keyword-item.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item_content' })
export class ViewSearchKeywordItemContent extends CommonBulkEntity {
  @Field(() => Number, { nullable: true })
  @Column({ name: 'cr_rank', type: 'float', nullable: true })
  crRank: number;

  @Field(() => String, { nullable: true })
  @Column({ name: 'cr_area', type: 'varchar', length: 255, nullable: true })
  crArea: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'cr_gdid', type: 'varchar', length: 255, nullable: true })
  crGdid: string;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'cr_gdid_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  slogContent: string;

  @Field(() => Number, { nullable: true })
  @Column({ name: 'cr_score_a', type: 'float', nullable: true })
  crScoreA: number;

  @Field(() => Number, { nullable: true })
  @Column({ name: 'cr_score_b', type: 'float', nullable: true })
  crScoreB: number;

  @Field(() => Number, { nullable: true })
  @Column({ name: 'cr_score_c', type: 'float', nullable: true })
  crScoreC: number;

  @Field(() => Number, { nullable: true })
  @Column({ name: 'cr_score_d', type: 'float', nullable: true })
  crScoreD: number;

  @Field(() => String, { nullable: true })
  @Column({ name: 'url', type: 'varchar', length: 255, nullable: true })
  url: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Field(() => Number, { nullable: true })
  @Column({ name: 'media_count', type: 'int', nullable: true })
  mediaCount: number;

  @Field(() => String, { nullable: true })
  @Column({ name: 'media_url', type: 'varchar', length: 255, nullable: true })
  createdAt: string;

  @Field(() => [ViewSearchKeywordItemContentTag])
  @OneToMany(
    () => ViewSearchKeywordItemContentTag,
    (tags) => tags.keywordItemContent,
  )
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
