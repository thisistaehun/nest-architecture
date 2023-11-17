import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Entity, OneToMany } from 'typeorm';
import { ViewSearchKeywordItem } from '../view-search/view-search.keyword-item.entity';

@Entity({ name: 'search_keyword' })
export class SearchKeyword extends CommonEntity {
  @OneToMany(
    () => ViewSearchKeywordItem,
    (keywordItems) => keywordItems.keyword,
  )
  items: ViewSearchKeywordItem[];
}
