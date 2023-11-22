import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { UserAuth } from '../user/type/user.auth.type';
import { CompetitionAnalysisService } from './competition-analysis.service';
import { CrawlSearchTypeOutput } from './dto/crawl.search-type/crawl.search-type.output';
import { ViewItemSearchInput } from './dto/item-search/view.item-search.input';
import { SmartBlockKeywordSearchInput } from './dto/smart-block/smart-block.keyword.search.input';
import { SearchKeyword } from './entities/keyword/keyword.entity';
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
    private readonly competitionAnalysisService: CompetitionAnalysisService,
  ) {}
  @Mutation(() => [ViewSearchKeywordItem])
  async viewItemSearch(
    @Args('input') input: ViewItemSearchInput,
    @CurrentUser('user') user: UserAuth,
  ) {
    return this.searchKeywordUsecase.execute(input, user.code);
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
  async viewItemSearchDetail(@Args('url') url: string) {
    return this.crawlKeywordItemDetailUsecase.execute(url);
  }

  @Query(() => [SearchKeyword], { nullable: true })
  async searchKeywords(@CurrentUser('user') user: UserAuth) {
    return this.competitionAnalysisService.findSearchKeywords(user.code);
  }
}
