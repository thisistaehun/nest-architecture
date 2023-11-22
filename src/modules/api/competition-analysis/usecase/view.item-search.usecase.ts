import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Queue } from 'bull';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser } from 'puppeteer';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { IViewItemSearchJobData as IViewItemSearchJob } from '../consumer/view.item-search.job.data.type';
import { ViewItemSearchInput } from '../dto/item-search/view.item-search.input';
import { ViewSearchKeywordItem } from '../entities/view-search/view-search.keyword-item.entity';
import { ViewSearchKeywordDetail } from '../entities/view-search/view-search.keyword.detail.entity';

@Injectable()
export class ViewItemSearchUsecase {
  constructor(
    @InjectBrowser('BrowserInstanceName') private readonly browser: Browser,
    @InjectQueue('competition-analysis') private queue: Queue,
  ) {}
  async execute(
    input: ViewItemSearchInput,
    userCode: string,
  ): Promise<ViewSearchKeywordItem[]> {
    const { keyword, page } = input;
    const viewGeneral = await axios.post(
      'https://api.datalab.tools/api/sdk/fetch/search/view/normal',
      {
        args: [keyword, { start: page }],
      },
      {
        headers: {
          Authorization: `Bearer ${envVariables.API_DATA_LAB_TOKEN}`,
        },
      },
    );

    const items = viewGeneral.data.items as ViewSearchKeywordItem[];

    const job: IViewItemSearchJob = {
      name: keyword,
      items,
      userCode,
    };

    await this.queue.add('view-item-search', job);

    return items;
  }

  private async crawlDetailPage(url: string): Promise<ViewSearchKeywordDetail> {
    const page = await this.browser.newPage();
    await page.goto(url);

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

    return new ViewSearchKeywordDetail(result);
  }
}
