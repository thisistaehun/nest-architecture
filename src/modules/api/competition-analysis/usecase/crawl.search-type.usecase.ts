import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser } from 'puppeteer';
import { CrawlSearchType } from '../type/crawl.search-type';

@Injectable()
export class CrawlSearchTypeUsecase {
  constructor(
    @InjectBrowser('BrowserInstanceName') private readonly browser: Browser,
  ) {}

  async execute(keyword: string) {
    const page = await this.browser.newPage();
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
