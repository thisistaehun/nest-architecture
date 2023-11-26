import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import * as puppeteer from 'puppeteer';
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
    private readonly searchCommandRepository: ItemSearchTransaction,
  ) {}

  @Process('item-search')
  async execute(job: Job) {
    this.logger.log(`start consume item-search job`);
    const crawledData = await this.crawlType(job.data.name);
    const keywordEntity = new SearchKeyword(job.data);
    keywordEntity.type = crawledData.type;
    await this.searchCommandRepository.execute(
      keywordEntity,
      job.data.userCode,
    );
  }

  private async crawlType(keyword: string) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(
      `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${keyword}`,
      );
      
      const data = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll('.fds-comps-header-headline'),
          );
          return elements.map((element) => element.textContent.trim());
        });
        this.logger.log(`sucessfully crawl search type`);
        if (data.length === 0) {
          return {
            type: CrawlSearchType.VIEW,
            data,
          };
        }
        
        return {
          type: CrawlSearchType.AIR_SEARCH,
          data,
    };
  }
}
