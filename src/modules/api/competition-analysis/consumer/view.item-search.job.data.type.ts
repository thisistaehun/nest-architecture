import { ViewSearchKeywordItem } from '../entities/view-search/view-search.keyword-item.entity';

export interface IViewItemSearchJobData {
  name: string;
  items: ViewSearchKeywordItem[];
  userCode: string;
}
