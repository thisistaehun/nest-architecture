import { Injectable } from '@nestjs/common';
import { PointRepository } from '../../point.repository';

@Injectable()
export class UsePointUsecase {
  constructor(private readonly pointRepository: PointRepository) {}
}
