import { registerEnumType } from '@nestjs/graphql';

export enum CrawlSearchType {
  VIEW = 'VIEW',
  AIR_SEARCH = 'AIR_SEARCH',
}

registerEnumType(CrawlSearchType, {
  name: 'CrawlSearchType',
});
