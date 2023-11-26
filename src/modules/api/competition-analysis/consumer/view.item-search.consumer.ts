import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as puppeteer from 'puppeteer';
import { ViewSearchCommandRepository } from '../cqrs/view-search.command.repository';
import { SearchKeyword } from '../entities/keyword/keyword.entity';
import { ViewSearchKeywordItem } from '../entities/view-search/view-search.keyword-item.entity';
import { CrawlSearchType } from '../type/crawl.search-type';
import { CrawlKeywordItemDetailUsecase } from '../usecase/crawl.keyword-item.detail.usecase';

@Processor('competition-analysis')
export class ViewItemSearchConsumer {
  constructor(
    private readonly viewSearchCommandRepository: ViewSearchCommandRepository,
    private readonly crawlDetailUsecase: CrawlKeywordItemDetailUsecase,
  ) {}

  @Process('view-item-search')
  async execute(job: Job) {
    const crawledData = await this.crawlType(job.data.name);
    const keywordEntity = new SearchKeyword(job.data);
    keywordEntity.type = crawledData.type;
    const itemsWithDetails = await Promise.all(
      keywordEntity.items.map(async (item: ViewSearchKeywordItem) => {
        const detail = await this.crawlDetailUsecase.execute(item.content.url);
        item.detail = detail;
        return item;
      }),
    );

    keywordEntity.items = itemsWithDetails;

    await this.viewSearchCommandRepository.saveKeyword(
      keywordEntity,
      job.data.userCode,
    );
  }

  private async crawlType(keyword: string) {
    const browser = await puppeteer.launch({
      headless: true,
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
