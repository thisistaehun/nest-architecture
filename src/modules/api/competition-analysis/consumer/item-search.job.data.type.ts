import { SearchKeywordItem } from '../entities/search/search-keyword-item.entity';

export interface ItemSearchJobData {
  name: string;
  items: SearchKeywordItem[];
  userCode: string;
}
