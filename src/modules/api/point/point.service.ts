import { Inject, Injectable } from '@nestjs/common';
import { POINT_QUERY_REPOSITORY } from 'src/symbols';
import { PointQueryRepository } from './cqrs/query/point.query.repository';

@Injectable()
export class PointService {
  constructor(
    @Inject(POINT_QUERY_REPOSITORY)
    private readonly pointRepository: PointQueryRepository,
  ) {}

  public async getTotalPoint(code: string) {
    return await this.pointRepository.getTotalPoint(code);
  }

  public async getPointTransaction(code: string, id: number) {
    return await this.pointRepository.getPointTransaction(code, id);
  }
}
