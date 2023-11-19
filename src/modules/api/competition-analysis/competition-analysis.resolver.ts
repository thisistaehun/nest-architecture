import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CrawlSearchTypeOutput } from './dto/crawl.search-type/crawl.search-type.output';
import { ViewItemSearchInput } from './dto/item-search/view.item-search.input';
import { SmartBlockKeywordSearchInput } from './dto/smart-block/smart-block.keyword.search.input';
import { SmartBlockKeyword } from './entities/smart-block/smart-block.keyword.entity';
import { ViewSearchKeywordItem } from './entities/view-search/view-search.keyword-item.entity';
import { ViewSearchKeywordDetail } from './entities/view-search/view-search.keyword.detail.entity';
import { CrawlKeywordItemDetailUsecase } from './usecase/crawl.keyword-item.detail.usecase';
import { CrawlSearchTypeUsecase } from './usecase/crawl.search-type.usecase';
import { GetCategoryUsecase } from './usecase/get-category.usecase';
import { SmartBlockItemSearchUsecase } from './usecase/smart-block.item-search.usecase';
import { SmartBlockUsecase } from './usecase/smart-block.usecase';
import { ViewItemSearchUsecase } from './usecase/view.item-search.usecase';

@Resolver()
export class CompetitionAnalysisResolver {
  constructor(
    private readonly searchKeywordUsecase: ViewItemSearchUsecase,
    private readonly smartBlockUsecase: SmartBlockUsecase,
    private readonly smartBlockItemSearchUsecase: SmartBlockItemSearchUsecase,
    private readonly getCategoryUsecase: GetCategoryUsecase,
    private readonly crawlSearchTypeUsecase: CrawlSearchTypeUsecase,
    private readonly crawlKeywordItemDetailUsecase: CrawlKeywordItemDetailUsecase,
  ) {}
  @Mutation(() => [ViewSearchKeywordItem])
  async viewItemSearch(@Args('input') input: ViewItemSearchInput) {
    return this.searchKeywordUsecase.execute(input);
  }

  @Mutation(() => [SmartBlockKeyword])
  async smartBlockKeyword(@Args('keyword') keyword: string) {
    return this.smartBlockUsecase.execute(keyword);
  }

  @Mutation(() => [ViewSearchKeywordItem])
  async smartBlockItemSearch(
    @Args('input') input: SmartBlockKeywordSearchInput,
  ) {
    return this.smartBlockItemSearchUsecase.execute(input);
  }

  @Mutation(() => [String])
  async getKeywordCategory(@Args('keyword') keyword: string) {
    return this.getCategoryUsecase.execute(keyword);
  }

  @Mutation(() => CrawlSearchTypeOutput)
  async crawlSearchType(@Args('keyword') keyword: string) {
    return this.crawlSearchTypeUsecase.execute(keyword);
  }

  @Mutation(() => [ViewSearchKeywordDetail])
  async viewItemSearchDetail(@Args('keyword') keyword: string) {
    return this.crawlKeywordItemDetailUsecase.execute(keyword);
  }
}
