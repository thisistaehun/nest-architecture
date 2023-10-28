import { Injectable } from '@nestjs/common';
import { PointQueryRepository } from '../../cqrs/query/point.query.repository';

@Injectable()
export class UsePointUsecase {
  constructor(private readonly pointRepository: PointQueryRepository) {}
}
