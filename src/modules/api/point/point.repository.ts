import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointTransaction } from './entities/point-transaction.entity';
import { TotalPoint } from './entities/total-point.entity';

@Injectable()
export class PointRepository {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(TotalPoint)
    private readonly totalPointRepository: Repository<TotalPoint>,
  ) {}
}
