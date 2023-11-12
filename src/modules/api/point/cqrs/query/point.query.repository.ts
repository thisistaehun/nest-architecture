import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointTransaction } from '../../entities/point-transaction.entity';
import { UserWallet } from '../../entities/total-point.entity';

@Injectable()
export class PointQueryRepository {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(UserWallet)
    private readonly totalPointRepository: Repository<UserWallet>,
  ) {}

  public async getUserWallet(userCode: string): Promise<UserWallet> {
    return await this.totalPointRepository.findOne({
      where: {
        user: {
          code: userCode,
        },
      },
      relations: {
        pointTransactions: true,
        user: true,
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
