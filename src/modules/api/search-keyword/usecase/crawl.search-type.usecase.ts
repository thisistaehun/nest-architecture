import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { CrawlSearchType } from '../type/crawl.search-type';

@Injectable()
export class CrawlSearchTypeUsecase {
  async execute(keyword: string) {
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
