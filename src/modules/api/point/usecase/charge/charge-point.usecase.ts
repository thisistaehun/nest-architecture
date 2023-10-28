import { Injectable } from '@nestjs/common';
import { PointRepository } from '../../point.repository';

@Injectable()
export class ChargePointUsecase {
  constructor(private readonly pointRepository: PointRepository) {}
}
