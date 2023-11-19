import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SearchKeyword } from '../entities/keyword/keyword.entity';

@Injectable()
export class ViewSearchQueryRepository {
  constructor(private readonly entityManager: EntityManager) {}

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
