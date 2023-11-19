import { Injectable } from '@nestjs/common';
import { ViewSearchQueryRepository } from './cqrs/view-search.query.repository';
import { SearchKeyword } from './entities/keyword/keyword.entity';

@Injectable()
export class CompetitionAnalysisService {
  constructor(
    private readonly viewSearchQueryRepository: ViewSearchQueryRepository,
  ) {}

  findSearchKeywords(userCode: string): Promise<SearchKeyword[]> {
    return this.viewSearchQueryRepository.findSearchKeywords(userCode);
  }
}
