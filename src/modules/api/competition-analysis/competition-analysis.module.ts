import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuppeteerModule } from 'nest-puppeteer';
import { CompetitionAnalysisResolver } from './competition-analysis.resolver';
import { CompetitionAnalysisService } from './competition-analysis.service';
import { ViewItemSearchConsumer } from './consumer/view.item-search.consumer';
import { ViewSearchCommandRepository } from './cqrs/view-search.command.repository';
import { ViewSearchQueryRepository } from './cqrs/view-search.query.repository';
import { KeywordToUser } from './entities/keyword/keyword-to-user.entity';
import { SearchKeyword } from './entities/keyword/keyword.entity';
import { SmartBlockKeyword } from './entities/smart-block/smart-block.keyword.entity';
import { ViewSearchKeywordItemChannel } from './entities/view-search/view-search.keyword-item-channel.entity';
import { ViewSearchKeywordItemContent } from './entities/view-search/view-search.keyword-item-content.entity';
import { ViewSearchKeywordItemContentTag } from './entities/view-search/view-search.keyword-item.content.tag.entity';
import { ViewSearchKeywordItem } from './entities/view-search/view-search.keyword-item.entity';
import { ViewSearchKeywordDetail } from './entities/view-search/view-search.keyword.detail.entity';
import { CrawlKeywordItemDetailUsecase } from './usecase/crawl.keyword-item.detail.usecase';
import { CrawlSearchTypeUsecase } from './usecase/crawl.search-type.usecase';
import { GetCategoryUsecase } from './usecase/get-category.usecase';
import { SmartBlockItemSearchUsecase } from './usecase/smart-block.item-search.usecase';
import { SmartBlockUsecase } from './usecase/smart-block.usecase';
import { ViewItemSearchUsecase } from './usecase/view.item-search.usecase';

@Module({
  imports: [
    PuppeteerModule.forFeature(),
    BullModule.registerQueue({
      name: 'competition-analysis',
    }),
    TypeOrmModule.forFeature([
      SearchKeyword,
      KeywordToUser,
      ViewSearchKeywordItem,
      ViewSearchKeywordDetail,
      ViewSearchKeywordItemChannel,
      ViewSearchKeywordItemContent,
      ViewSearchKeywordItemContentTag,
      SmartBlockKeyword,
    ]),
  ],
  providers: [
    CompetitionAnalysisResolver,
    ViewItemSearchUsecase,
    SmartBlockUsecase,
    SmartBlockItemSearchUsecase,
    GetCategoryUsecase,
    CrawlSearchTypeUsecase,
    CrawlKeywordItemDetailUsecase,
    CompetitionAnalysisService,
    ViewItemSearchConsumer,
    ViewSearchCommandRepository,
    ViewSearchQueryRepository,
  ],
})
export class CompetitionAnalysisModule {}
