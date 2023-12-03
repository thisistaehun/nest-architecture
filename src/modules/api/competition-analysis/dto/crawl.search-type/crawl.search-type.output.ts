import { Field, ObjectType } from '@nestjs/graphql';
import { CrawlSearchType } from '../../type/crawl.search-type';

@ObjectType()
export class CrawlSearchTypeOutput {
  @Field(() => CrawlSearchType, {
    description: '검색 타입',
  })
  type: CrawlSearchType;

  @Field(() => [String], {
    description: '검색된 데이터',
  })
  data: string[];
}
