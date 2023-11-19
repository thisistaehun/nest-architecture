import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser } from 'puppeteer';

@Injectable()
export class CrawlKeywordItemDetailUsecase {
  constructor(
    @InjectBrowser('BrowserInstanceName') private readonly browser: Browser,
  ) {}

  public async execute(url: string): Promise<any> {
    return this.crawlDetailPage(url);
  }

  private async crawlDetailPage(url: string): Promise<any> {
    const page = await this.browser.newPage();
    // 페이지 이동
    await page.goto(url);

    // 병렬 처리를 위해 Promise.all을 사용합니다.
    const [quotations, placesMap, contents, likes, tags, replies] =
      await Promise.all([
        // 인용문 크롤링
        page.evaluate(() => {
          const elements = Array.from(
            document.querySelectorAll('.se-quotation'),
          );
          return elements.map((element) => element.textContent.trim());
        }),
        // 장소 맵 크롤링
        page.evaluate(() => {
          const elements = Array.from(
            document.querySelectorAll('.se-section-placesMap'),
          );
          return elements.map((element) => element.textContent.trim());
        }),
        // 내용 크롤링
        page.evaluate(() => {
          const elements = Array.from(
            document.querySelectorAll('.se-main-container'),
          );
          return elements.map((element) => element.textContent.trim()).join('');
        }),

        // 좋아요 크롤링
        page.evaluate(() => {
          const element = document.querySelector(
            '.u_likeit_list_btn .u_cnt ._count',
          );
          return element ? element.textContent.trim() : '10';
        }),
        // 태그 크롤링
        page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('.post_tag'));
          // li 태그를 배열로 만들어서 반환합니다. 첫 요소를 제거합니다.
          return elements
            .map((element) => element.textContent.split('#'))
            .flat()
            .slice(1);
        }),
        // 댓글 크롤링
        page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('.btn_reply'));
          return elements.map((element) => element.textContent.trim());
        }),
      ]);

    await page.close();
    const result = {
      quotations: quotations.length,
      placesMap: placesMap.length,
      contents: contents.length,
      contentsWithoutBlanks: contents.replace(/\s/g, '').length,
      likes: Number(likes),
      tags: tags.length,
      replies: replies.length > 0 ? Number(replies[0].split(' ')[1]) : '0',
    };

    return result;
  }
}
