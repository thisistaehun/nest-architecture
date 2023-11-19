import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { CompetitionAnalysisResolver } from './competition-analysis.resolver';
import { CrawlKeywordItemDetailUsecase } from './usecase/crawl.keyword-item.detail.usecase';
import { CrawlSearchTypeUsecase } from './usecase/crawl.search-type.usecase';
import { GetCategoryUsecase } from './usecase/get-category.usecase';
import { SmartBlockItemSearchUsecase } from './usecase/smart-block.item-search.usecase';
import { SmartBlockUsecase } from './usecase/smart-block.usecase';
import { ViewItemSearchUsecase } from './usecase/view.item-search.usecase';

@Module({
  imports: [PuppeteerModule.forFeature()],
  providers: [
    CompetitionAnalysisResolver,
    ViewItemSearchUsecase,
    SmartBlockUsecase,
    SmartBlockItemSearchUsecase,
    GetCategoryUsecase,
    CrawlSearchTypeUsecase,
    CrawlKeywordItemDetailUsecase,
  ],
})
export class CompetitionAnalysisModule {}
