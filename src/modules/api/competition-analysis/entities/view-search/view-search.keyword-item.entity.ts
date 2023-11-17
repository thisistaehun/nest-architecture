import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { SearchKeyword } from '../keyword/keyword.entity';
import { ViewSearchKeywordItemChannel } from './view-search.keyword-item-channel.entity';
import { ViewSearchKeywordItemContent } from './view-search.keyword-item-content.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item' })
export class ViewSearchKeywordItem extends CommonBulkEntity {
  @Field(() => ViewSearchKeywordItemChannel)
  @OneToOne(
    () => ViewSearchKeywordItemChannel,
    (keywordItemChannel) => keywordItemChannel.keywordItem,
  )
  channel: ViewSearchKeywordItemChannel;

  @Field(() => ViewSearchKeywordItemContent)
  @OneToOne(
    () => ViewSearchKeywordItemContent,
    (keywordItemContent) => keywordItemContent.keywordItem,
  )
  content: ViewSearchKeywordItemContent;

  @ManyToOne(() => SearchKeyword, (keyword) => keyword.items)
  @JoinColumn({ name: 'search_keyword_id' })
  keyword: SearchKeyword;
}
