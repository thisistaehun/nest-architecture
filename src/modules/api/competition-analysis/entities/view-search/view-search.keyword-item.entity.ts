import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { SearchKeyword } from '../keyword/keyword.entity';
import { ViewSearchKeywordItemChannel } from './view-search.keyword-item-channel.entity';
import { ViewSearchKeywordItemContent } from './view-search.keyword-item-content.entity';
import { ViewSearchKeywordDetail } from './view-search.keyword.detail.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item' })
export class ViewSearchKeywordItem extends CommonBulkEntity {
  @Field(() => ViewSearchKeywordItemChannel, {
    description: '검색 키워드 아이템 채널',
  })
  @OneToOne(
    () => ViewSearchKeywordItemChannel,
    (keywordItemChannel) => keywordItemChannel.keywordItem,
  )
  channel: ViewSearchKeywordItemChannel;

  @Field(() => ViewSearchKeywordItemContent, {
    description: '검색 키워드 아이템 컨텐츠',
  })
  @OneToOne(
    () => ViewSearchKeywordItemContent,
    (keywordItemContent) => keywordItemContent.keywordItem,
  )
  content: ViewSearchKeywordItemContent;

  @ManyToOne(() => SearchKeyword, (keyword) => keyword.items, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'search_keyword_id' })
  keyword: SearchKeyword;

  @Field(() => ViewSearchKeywordDetail)
  @OneToOne(() => ViewSearchKeywordDetail, (detail) => detail.keywordItem)
  detail: ViewSearchKeywordDetail;

  constructor(partial: Partial<ViewSearchKeywordItem>) {
    super();
    Object.assign(this, partial);
  }
}
