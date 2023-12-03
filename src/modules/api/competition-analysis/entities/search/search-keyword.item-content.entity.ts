import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { SearchKeywordItem } from './search-keyword-item.entity';
import { SearchKeywordItemContentTag } from './search-keyword.item-content.tag.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item_content' })
export class SearchKeywordItemContent extends CommonBulkEntity {
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
  @Column({ name: 'url', type: 'varchar', length: 1000, nullable: true })
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

  @Field(() => [SearchKeywordItemContentTag], { nullable: true })
  @OneToMany(
    () => SearchKeywordItemContentTag,
    (tags) => tags.keywordItemContent,
  )
  tags: SearchKeywordItemContentTag[];

  @Field(() => String, { nullable: true })
  serviceType: string;

  @Field(() => String, { nullable: true })
  serviceId: string;

  @Field(() => String, { nullable: true })
  contentId: string;

  @OneToOne(() => SearchKeywordItem, (keywordItem) => keywordItem.content, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'keyword_item_id' })
  keywordItem: SearchKeywordItem;

  constructor(partial: Partial<SearchKeywordItemContent>) {
    super();
    Object.assign(this, partial);
  }
}
