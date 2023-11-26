import { Injectable } from '@nestjs/common';
import { SearchQueryRepository } from './cqrs/search.query.repository';
import { SearchKeyword } from './entities/keyword/keyword.entity';

@Injectable()
export class SearchKeywordService {
  constructor(
    private readonly viewSearchQueryRepository: SearchQueryRepository,
  ) {}

  findSearchKeywords(userCode: string): Promise<SearchKeyword[]> {
    return this.viewSearchQueryRepository.findSearchKeywords(userCode);
  }
}
