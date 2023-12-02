import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PostAnalysisInput } from '../dto/post-analysis.input';
import { PostDetailKeyword } from '../entities/post-detail-keyword.entity';
import { PostDetail } from '../entities/post-detail.entity';

@Injectable()
export class PostAnalysisUsecase {
  constructor() {}

  public async execute(input: PostAnalysisInput): Promise<PostDetail[]> {
    const postDetails: PostDetail[] = [];

    for (const url of input.postUrls) {
      const axiosOption = {
        method: 'GET',
        url: url,
      };

      const response = await axios(axiosOption);
      const $ = cheerio.load(response.data);
      // title 찾기
      let title = '';
      if ($('div.se-title-text').text().length !== 0) {
        title = $('div.se-title-text').text();
      } else if ($('div.post_ct > h3').text().length !== 0) {
        title = $('div.post_ct > h3').text();
      }
      // 공백 제거
      title = title.replace(/\n/gi, '').replace(/\t/gi, '').trim();

      let stringContents = '';
      if (
        $('div.se-main-container p.se-text-paragraph').length !== 0 ||
        ($('div.post_ct > div').length !== 0 &&
          $('div#viewTypeSelector').text().length) < 10
      ) {
        if ($('div.se-main-container p.se-text-paragraph').length !== 0) {
          stringContents = $(
            'div.se-main-container p.se-text-paragraph',
          ).text();
        } else if ($('div.post_ct > div').length !== 0) {
          stringContents = $('div.post_ct > div').text();
        } else if ($('div.postViewArea > div').length !== 0) {
          stringContents = $('div.postViewArea > div').text();
        } else {
          stringContents = $('#body div._postView div#viewTypeSelector')
            .text()
            .trim();
        }

        if ($('div.__se_code_view').text().length > 0) {
          stringContents += $('div.__se_code_view').text();
        }
      }

      const arrayContents = stringContents
        .split(/ |\(|\)/)
        .filter((el) => el !== '​' && el.length > 0);

      const contentTags = arrayContents
        .filter((el) => el.includes('#'))
        .map((el) => el.replace(',', ''));

      /** 태그 가져오기 **/
      const bottomTags = $('div.post_tag')
        .text()
        .trim()
        .replace(/\n/gi, '')
        .replace(/\t/gi, '')
        .split('#')
        .filter((el) => el)
        .map((el) => '#' + el);

      const keywords = [];

      for (const keyword of input.keywords) {
        const keywordCount = arrayContents.filter((el) =>
          el.includes(keyword),
        ).length;
        keywords.push(
          new PostDetailKeyword({
            name: keyword,
            frequency: keywordCount,
          }),
        );
      }

      const postDetail: PostDetail = new PostDetail({
        title,
        targetUrl: url,
        content: stringContents,
        photoCount: 10,
        videoCount: 30,
        bottomTags,
        contentTags,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        keywords,
      });

      postDetails.push(postDetail);
    }

    return postDetails;
  }
}
