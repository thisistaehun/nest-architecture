import { Injectable } from '@nestjs/common';
import { SearchQueryRepository as ViewSearchQueryRepository } from './cqrs/search.query.repository';
import { SearchKeyword } from './entities/keyword/keyword.entity';

@Injectable()
export class CompetitionAnalysisService {
  constructor(
    private readonly viewSearchQueryRepository: ViewSearchQueryRepository,
  ) {}

  findSearchKeywords(userCode: string): Promise<SearchKeyword[]> {
    return this.viewSearchQueryRepository.findSearchKeywords(userCode);
  }

  findSearchKeyword(keyword: string): Promise<SearchKeyword> {
    return this.viewSearchQueryRepository.findSearchKeyword(keyword);
  }
}
