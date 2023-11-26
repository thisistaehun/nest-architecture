import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CrawlSearchType } from '../../type/crawl.search-type';
import { SearchKeywordItem } from '../search/search-keyword-item.entity';
import { SmartBlockKeyword } from '../smart-block/smart-block.keyword.entity';
import { KeywordToUser } from './keyword-to-user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'search_keyword' })
export class SearchKeyword extends CommonEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  @Field(() => String, {
    description: '검색 키워드',
  })
  name: string;

  @Column({ name: 'type', type: 'varchar', length: 255 })
  @Field(() => CrawlSearchType, {
    description: '검색 키워드 타입',
  })
  type: CrawlSearchType;

  @OneToMany(
    () => SearchKeywordItem,
    (keywordItems) => keywordItems.keyword,
  )
  @Field(() => [SearchKeywordItem], {
    description: '검색 키워드 아이템',
  })
  items: SearchKeywordItem[];

  @OneToMany(() => KeywordToUser, (keywordToUser) => keywordToUser.keyword)
  keywordToUsers: KeywordToUser[];

  @OneToMany(
    () => SmartBlockKeyword,
    (smartBlockKeyword) => smartBlockKeyword.keyword,
  )
  smartBlockKeywords: SmartBlockKeyword[];

  constructor(partial: Partial<SearchKeyword>) {
    super();
    Object.assign(this, partial);
  }
}
