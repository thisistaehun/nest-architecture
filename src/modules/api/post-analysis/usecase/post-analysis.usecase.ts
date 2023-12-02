import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { crawlContents } from 'src/modules/crawling-functions/crawl.contents';
import { crawlTitle } from 'src/modules/crawling-functions/crawl.title';
import { crawlVideos } from 'src/modules/crawling-functions/crawl.videos';
import { PostAnalysisInput } from '../dto/post-analysis.input';
import { PostDetailKeyword } from '../entities/post-detail-keyword.entity';
import { PostDetail } from '../entities/post-detail.entity';
import { PostType } from '../type/post.type';

@Injectable()
export class PostAnalysisUsecase {
  constructor() {}

  public async execute(input: PostAnalysisInput): Promise<PostDetail[]> {
    const postDetails: PostDetail[] = [];

    for (const url of input.postUrls) {
      await this.createPostDetail(url, input, postDetails);
    }

    return postDetails;
  }

  private async createPostDetail(
    url: string,
    input: PostAnalysisInput,
    postDetails: PostDetail[],
  ) {
    const $ = await cheerioAxios(url);
    // title 찾기
    const title = crawlTitle($);
    let { arrayContents, stringContents } = crawlContents($);
    let postType = PostType.GENERAL;
    const videos = crawlVideos($);
    const { bottomTags, contentTags } = this.findTags(arrayContents, $);
    const keywords = this.findKeywords(input, arrayContents);
    ({ stringContents, postType } = this.checkHidden(
      $,
      stringContents,
      postType,
    ));

    const postDetail: PostDetail = new PostDetail({
      title,
      targetUrl: url,
      content: stringContents,
      photoCount: 10,
      videoCount: videos.length,
      bottomTags,
      contentTags,
      postType,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      keywords,
    });

    postDetails.push(postDetail);
  }

  private findTags(arrayContents: string[], $: cheerio.Root) {
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
    return { bottomTags, contentTags };
  }

  private checkHidden(
    $: cheerio.Root,
    stringContents: string,
    postType: PostType,
  ) {
    if ($('div.__se_code_view').text().length > 0) {
      const hidden = $('div.__se_code_view').text();
      stringContents += '\n (히든글)' + hidden;
      postType = PostType.HIDDEN;
    }
    return { stringContents, postType };
  }

  private findKeywords(input: PostAnalysisInput, arrayContents: string[]) {
    const keywords = [];

    for (const keyword of input.keywords) {
      let keywordCount = 0;
      const morphemes = [];
      for (const content of arrayContents) {
        if (content.includes(keyword)) {
          keywordCount++;
          morphemes.push(content);
        }
      }

      keywords.push(
        new PostDetailKeyword({
          name: keyword,
          frequency: keywordCount,
          morphemes,
        }),
      );
    }
    return keywords;
  }
}

async function cheerioAxios(url: string) {
  const axiosOption = {
    method: 'GET',
    url: url,
  };

  const response = await axios(axiosOption);
  const $ = cheerio.load(response.data);
  return $;
}
