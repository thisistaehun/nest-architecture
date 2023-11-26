import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { UserAuth } from '../user/type/user.auth.type';
import { CrawlSearchTypeOutput } from './dto/crawl.search-type/crawl.search-type.output';
import { ViewItemSearchInput } from './dto/item-search/view.item-search.input';
import { SmartBlockKeywordSearchInput } from './dto/smart-block/smart-block.keyword.search.input';
import { SearchKeyword } from './entities/keyword/keyword.entity';
import { SearchKeywordItem } from './entities/search/search-keyword-item.entity';
import { SearchKeywordDetail } from './entities/search/search-keyword.detail.entity';
import { SearchKeywordStat } from './entities/search/search-keyword.stat.entity';
import { SmartBlockKeyword } from './entities/smart-block/smart-block.keyword.entity';
import { SearchKeywordService } from './search-keyword.service';
import { CrawlKeywordItemDetailUsecase } from './usecase/crawl.keyword-item.detail.usecase';
import { CrawlSearchTypeUsecase } from './usecase/crawl.search-type.usecase';
import { GetCategoryUsecase } from './usecase/get-category.usecase';
import { GetStatUsecase } from './usecase/get-stat.usecase';
import { ItemSearchUsecase } from './usecase/item-search.usecase';
import { SmartBlockItemSearchUsecase } from './usecase/smart-block.item-search.usecase';
import { SmartBlockUsecase } from './usecase/smart-block.usecase';

@Resolver()
export class SearchKeywordResolver {
  constructor(
    private readonly searchKeywordUsecase: ItemSearchUsecase,
    private readonly smartBlockUsecase: SmartBlockUsecase,
    private readonly smartBlockItemSearchUsecase: SmartBlockItemSearchUsecase,
    private readonly getCategoryUsecase: GetCategoryUsecase,
    private readonly crawlSearchTypeUsecase: CrawlSearchTypeUsecase,
    private readonly crawlKeywordItemDetailUsecase: CrawlKeywordItemDetailUsecase,
    private readonly getStatUsecase: GetStatUsecase,
    private readonly competitionAnalysisService: SearchKeywordService,
  ) {}
  @Mutation(() => [SearchKeywordItem], {
    description: '경쟁도 분석 검색 키워드로 키워드 TOP10 포스팅 검색을 진행합니다. (뷰, 에어 서치)'
  })
  async itemSearch(
    @Args('input') input: ViewItemSearchInput,
    @CurrentUser('user') user: UserAuth,
  ) {
    return this.searchKeywordUsecase.execute(input, user.code);
  }

  @Mutation(() => [SmartBlockKeyword], {
    description: '키워드로 스마트 블록 서치를 진행합니다. '
  })
  async smartBlockKeyword(@Args('keyword') keyword: string) {
    return this.smartBlockUsecase.execute(keyword);
  }

  @Mutation(() => [SearchKeywordItem], {
    description: '스마트 블록 키워드로 아이템 서치를 진행합니다.'
  })
  async smartBlockItemSearch(
    @Args('input') input: SmartBlockKeywordSearchInput,
  ) {
    return this.smartBlockItemSearchUsecase.execute(input);
  }

  @Mutation(() => [String], {
    description: '특정 키워드에 대해 카테고리 값을 받아옵니다. '
  })
  async getKeywordCategory(@Args('keyword') keyword: string) {
    return this.getCategoryUsecase.execute(keyword);
  }

  @Mutation(() => CrawlSearchTypeOutput, {
    description: '키워드 타입을 받아옵니다. (View or Air)'
  })
  async crawlSearchType(@Args('keyword') keyword: string) {
    return this.crawlSearchTypeUsecase.execute(keyword);
  }

  @Mutation(() => SearchKeywordDetail, {
    description: '디테일한 아이템 서치를 진행합니다.(좋아요, 댓글, 본문, 장소, 인용 등의 길이)'
  })
  async crawlItemSearchDetail(@Args('url') url: string) {
    return this.crawlKeywordItemDetailUsecase.execute(url);
  }

  @Query(() => [SearchKeyword], {
    description: '유저가 검색했던 키워드 목록(과 연결된 아이템)을 가져옵니다.',
    nullable: true
  })
  async searchKeywords(@CurrentUser('user') user: UserAuth) {
    return this.competitionAnalysisService.findSearchKeywords(user.code);
  }

  @Mutation(() => SearchKeywordStat, {
    description: '키워드 검색량 및 클릭량 등을 가져옵니다. '
  })
  async getKeywordStat(@Args('keyword') keyword: string) {
    return this.getStatUsecase.execute(keyword);
  }
}
