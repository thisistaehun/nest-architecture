import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ViewSearchKeywordItemContent } from './view-search.keyword-item-content.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item_content_tag' })
export class ViewSearchKeywordItemContentTag extends CommonBulkEntity {
  @Field(() => String, { nullable: true })
  @Column({ name: 'query', type: 'varchar', length: 255 })
  query: string;

  @ManyToOne(
    () => ViewSearchKeywordItemContent,
    (keywordItemContent) => keywordItemContent.tags,
  )
  @Field(() => ViewSearchKeywordItemContent, { nullable: true })
  @JoinColumn({ name: 'keyword_item_content_id' })
  keywordItemContent: ViewSearchKeywordItemContent;
}
