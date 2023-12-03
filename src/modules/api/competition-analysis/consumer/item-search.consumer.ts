import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { DgLoggerImpl } from 'src/modules/infrastructure/logger/logger.implement';
import { DG_LOGGER } from 'src/symbols';
import { ItemSearchTransaction } from '../cqrs/command/item-search.transaction';
import { SearchKeyword } from '../entities/keyword/keyword.entity';
import { CrawlSearchType } from '../type/crawl.search-type';

@Processor('item-search')
export class ItemSearchConsumer {
  constructor(
    @Inject(DG_LOGGER)
    private readonly logger: DgLoggerImpl,
    private readonly itemSearchTransaction: ItemSearchTransaction,
  ) {}

  @Process('item-search')
  async execute(job: Job) {
    this.logger.log(`start consume item-search job`);
    const keywordEntity = new SearchKeyword(job.data);
    keywordEntity.type = CrawlSearchType.VIEW;
    await this.itemSearchTransaction.execute(keywordEntity, job.data.userCode);
  }
}
