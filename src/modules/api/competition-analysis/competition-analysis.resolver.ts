import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SmartBlockKeywordSearchInput } from './dto/smart-block.keyword.search.input';
import { SmartBlockKeyword } from './entities/smart-block/smart-block.keyword.entity';
import { ViewSearchKeywordItem } from './entities/view-search/view-search.keyword-item.entity';
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
  ) {}
  @Mutation(() => [ViewSearchKeywordItem])
  async viewItemSearch(@Args('keyword') keyword: string) {
    return this.searchKeywordUsecase.execute(keyword);
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
}
