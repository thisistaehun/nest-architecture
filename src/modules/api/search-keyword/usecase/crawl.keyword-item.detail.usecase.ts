import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as puppeteer from 'puppeteer';
import { DgLoggerImpl } from 'src/modules/infrastructure/logger/logger.implement';
import { DG_LOGGER } from 'src/symbols';
import { SearchQueryRepository } from '../cqrs/search.query.repository';
import { SearchKeywordDetail } from '../entities/search/search-keyword.detail.entity';

@Injectable()
export class CrawlKeywordItemDetailUsecase {
  constructor(
    @InjectQueue('item-detail')
    private readonly queue: Queue,
    private readonly repository: SearchQueryRepository,
    @Inject(DG_LOGGER)
    private readonly logger: DgLoggerImpl,
  ) {}

  public async execute(url: string): Promise<SearchKeywordDetail> {
    const item = await this.repository.findItemByUrl(url);
    const detail = await this.crawlDetailPage(url);
    detail.keywordItem = item;
    await this.queue.add('item-detail-saving', {
      detail,
    });
    this.logger.log(`Successfully add detail for queue`);

    return detail;
  }

  private async crawlDetailPage(url: string): Promise<SearchKeywordDetail> {
    const browser = await puppeteer.launch({});
    this.logger.log('hi');
    const page = await browser.newPage();
    await page.goto(url);
    this.logger.log(`Successfully go to the page ${url}`);

    // 인용문, 장소 맵, 내용, 좋아요, 태그, 댓글 크롤링
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
        page.$$eval('div.btn_like', (divs) =>
          divs.map((div) => div.textContent),
        ),
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

    this.logger.log(`Successfully crawl the detail data ${url}`);
    const likesArray = likes.map((like) => like.replace(/[^0-9]/g, ''));
    const likesCount = likesArray.length > 0 ? Number(likesArray[0]) : 0;

    const result = {
      quotations: quotations.length ?? 0,
      placesMap: placesMap.length ?? 0,
      contents: contents.length ?? 0,
      contentsWithoutBlanks: contents.replace(/\s/g, '').length ?? 0,
      likes: likesCount ?? 0,
      tags: tags.length ?? 0,
      replies: replies.length > 0 ? Number(replies[0].split(' ')[1]) : 0,
    };

    return new SearchKeywordDetail(result);
  }
}
