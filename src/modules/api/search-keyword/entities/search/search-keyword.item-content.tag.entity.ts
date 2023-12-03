import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SearchKeywordItemContent } from './search-keyword.item-content.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item_content_tag' })
export class SearchKeywordItemContentTag extends CommonBulkEntity {
  @Field(() => String, { nullable: true })
  @Column({
    name: 'query',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: '',
  })
  query: string;

  @ManyToOne(
    () => SearchKeywordItemContent,
    (keywordItemContent) => keywordItemContent.tags,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @Field(() => SearchKeywordItemContent, { nullable: true })
  @JoinColumn({ name: 'keyword_item_content_id' })
  keywordItemContent: SearchKeywordItemContent;

  constructor(partial: Partial<SearchKeywordItemContentTag>) {
    super();
    Object.assign(this, partial);
  }
}
