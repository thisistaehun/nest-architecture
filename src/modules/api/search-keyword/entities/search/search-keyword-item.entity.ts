import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { SearchKeyword } from '../keyword/keyword.entity';
import { SearchKeywordDetail } from './search-keyword.detail.entity';
import { SearchKeywordItemChannel } from './search-keyword.item-channel.entity';
import { SearchKeywordItemContent } from './search-keyword.item-content.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item' })
export class SearchKeywordItem extends CommonBulkEntity {
  @Field(() => SearchKeywordItemChannel, {
    description: '검색 키워드 아이템 채널',
  })
  @OneToOne(
    () => SearchKeywordItemChannel,
    (keywordItemChannel) => keywordItemChannel.keywordItem,
  )
  channel: SearchKeywordItemChannel;

  @Field(() => SearchKeywordItemContent, {
    description: '검색 키워드 아이템 컨텐츠',
  })
  @OneToOne(
    () => SearchKeywordItemContent,
    (keywordItemContent) => keywordItemContent.keywordItem,
  )
  content: SearchKeywordItemContent;

  @ManyToOne(() => SearchKeyword, (keyword) => keyword.items, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'search_keyword_id' })
  keyword: SearchKeyword;

  @Field(() => SearchKeywordDetail)
  @OneToOne(() => SearchKeywordDetail, (detail) => detail.keywordItem)
  detail: SearchKeywordDetail;

  constructor(partial: Partial<SearchKeywordItem>) {
    super();
    Object.assign(this, partial);
  }
}
