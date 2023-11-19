import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Queue } from 'bull';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser } from 'puppeteer';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
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
    const { keyword, page, withDetail } = input;
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
    const itemsForJob = [];
    if (withDetail) {
      await Promise.all(
        items.map(async (item) => {
          const itemEntity = new ViewSearchKeywordItem(item);
          const detail = await this.crawlDetailPage(item.content.url);
          const detailEntity = new ViewSearchKeywordDetail(detail);
          itemEntity.detail = detailEntity;
          item = itemEntity;
          itemsForJob.push(item);
        }),
      );
    } else {
      itemsForJob.push(...items);
    }

    const job = {
      name: keyword,
      items: itemsForJob,
      userCode,
    };

    await this.queue.add('view-item-search', job);

    return items;
  }

  private async crawlDetailPage(url: string): Promise<any> {
    const page = await this.browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if (req.resourceType() === 'image') {
        req.abort();
      } else {
        req.continue();
      }
    });

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
        page.evaluate(() => {
          const element = document.querySelector('.u_likeit_list_btn');
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
      likes: 10,
      tags: tags.length,
      replies: replies.length > 0 ? Number(replies[0].split(' ')[1]) : 0,
    };

    return result;
  }
}
