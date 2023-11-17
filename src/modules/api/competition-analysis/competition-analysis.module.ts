import { Module } from '@nestjs/common';
import { CompetitionAnalysisResolver } from './competition-analysis.resolver';
import { GetCategoryUsecase } from './usecase/get-category.usecase';
import { SmartBlockItemSearchUsecase } from './usecase/smart-block.item-search.usecase';
import { SmartBlockUsecase } from './usecase/smart-block.usecase';
import { ViewItemSearchUsecase } from './usecase/view.item-search.usecase';

@Module({
  providers: [
    CompetitionAnalysisResolver,
    ViewItemSearchUsecase,
    SmartBlockUsecase,
    SmartBlockItemSearchUsecase,
    GetCategoryUsecase,
  ],
})
export class CompetitionAnalysisModule {}
