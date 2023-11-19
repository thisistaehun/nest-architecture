import { InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Entity, OneToMany } from 'typeorm';
import { SmartBlockKeyword } from '../smart-block/smart-block.keyword.entity';
import { ViewSearchKeywordItem } from '../view-search/view-search.keyword-item.entity';
import { KeywordToUser } from './keyword-to-user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'search_keyword' })
export class SearchKeyword extends CommonEntity {
  @OneToMany(
    () => ViewSearchKeywordItem,
    (keywordItems) => keywordItems.keyword,
  )
  items: ViewSearchKeywordItem[];

  @OneToMany(() => KeywordToUser, (keywordToUser) => keywordToUser.keyword)
  keywordToUsers: KeywordToUser[];

  @OneToMany(
    () => SmartBlockKeyword,
    (smartBlockKeyword) => smartBlockKeyword.keyword,
  )
  smartBlockKeywords: SmartBlockKeyword[];
}
