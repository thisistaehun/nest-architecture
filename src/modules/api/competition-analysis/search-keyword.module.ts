import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemDetailSavingConsumer } from './consumer/item-detail-saving.conumer';
import { ItemSearchConsumer } from './consumer/item-search.consumer';
import { ItemDetailSavingTransaction } from './cqrs/command/item-detail.saving.transaction';
import { ItemSearchTransaction } from './cqrs/command/item-search.transaction';
import { SearchQueryRepository } from './cqrs/search.query.repository';
import { KeywordToUser } from './entities/keyword/keyword-to-user.entity';
import { SearchKeyword } from './entities/keyword/keyword.entity';
import { SearchKeywordItem } from './entities/search/search-keyword-item.entity';
import { SearchKeywordDetail } from './entities/search/search-keyword.detail.entity';
import { SearchKeywordItemChannel } from './entities/search/search-keyword.item-channel.entity';
import { SearchKeywordItemContent } from './entities/search/search-keyword.item-content.entity';
import { SearchKeywordItemContentTag } from './entities/search/search-keyword.item-content.tag.entity';
import { SmartBlockKeyword } from './entities/smart-block/smart-block.keyword.entity';
import { SearchKeywordResolver } from './search-keyword.resolver';
import { SearchKeywordService } from './search-keyword.service';
import { CrawlKeywordItemDetailUsecase } from './usecase/crawl.keyword-item.detail.usecase';
import { CrawlSearchTypeUsecase } from './usecase/crawl.search-type.usecase';
import { GetCategoryUsecase } from './usecase/get-category.usecase';
import { GetStatUsecase } from './usecase/get-stat.usecase';
import { ItemSearchUsecase } from './usecase/item-search.usecase';
import { SmartBlockItemSearchUsecase } from './usecase/smart-block.item-search.usecase';
import { SmartBlockUsecase } from './usecase/smart-block.usecase';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'item-search',
    }),
    BullModule.registerQueue({
      name: 'item-detail',
    }),
    TypeOrmModule.forFeature([
      SearchKeyword,
      KeywordToUser,
      SearchKeywordItem,
      SearchKeywordDetail,
      SearchKeywordItemChannel,
      SearchKeywordItemContent,
      SearchKeywordItemContentTag,
      SmartBlockKeyword,
    ]),
  ],
  providers: [
    SearchKeywordResolver,
    ItemSearchUsecase,
    SmartBlockUsecase,
    SmartBlockItemSearchUsecase,
    GetCategoryUsecase,
    CrawlSearchTypeUsecase,
    CrawlKeywordItemDetailUsecase,
    GetStatUsecase,
    SearchKeywordService,
    ItemSearchConsumer,
    ItemDetailSavingConsumer,
    ItemSearchTransaction,
    ItemDetailSavingTransaction,
    SearchQueryRepository,
  ],
})
export class SearchKeywordModule {}
