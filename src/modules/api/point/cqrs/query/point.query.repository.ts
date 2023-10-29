import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointTransaction } from '../../entities/point-transaction.entity';
import { TotalPoint } from '../../entities/total-point.entity';

@Injectable()
export class PointQueryRepository {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(TotalPoint)
    private readonly totalPointRepository: Repository<TotalPoint>,
  ) {}

  public async getTotalPoint(userCode: string): Promise<TotalPoint> {
    return await this.totalPointRepository.findOne({
      where: {
        user: {
          code: userCode,
        },
      },
      relations: {
        pointTransactions: true,
      },
    });
  }

  public async getPointTransaction(
    userCode: string,
    code: number,
  ): Promise<PointTransaction> {
    return await this.pointTransactionRepository.findOne({
      where: {
        id: code,
        totalPoint: {
          user: {
            code: userCode,
          },
        },
      },
    });
  }
}
