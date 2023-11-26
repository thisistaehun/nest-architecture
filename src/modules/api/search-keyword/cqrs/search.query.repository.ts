import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SearchKeyword } from '../entities/keyword/keyword.entity';
import { SearchKeywordItem } from '../entities/search/search-keyword-item.entity';

@Injectable()
export class SearchQueryRepository {
  constructor(private readonly entityManager: EntityManager) { }

  async findItemByUrl(url: string) {
    const item = await this.entityManager.findOne(SearchKeywordItem, {
      where: {
        content: {
          url,
        }
      },
      relations: {
        channel: true,
        content: true,
        detail: true,
      }
    })

    return item;
  }


  async findSearchKeywords(userCode: string) {
    const keywords = await this.entityManager.find(SearchKeyword, {
      where: {
        keywordToUsers: {
          user: {
            code: userCode,
          },
        },
      },
      relations: {
        keywordToUsers: true,
        items: {
          detail: true,
          channel: true,
          content: true,
        },
      },
    });

    return keywords;
  }
}
