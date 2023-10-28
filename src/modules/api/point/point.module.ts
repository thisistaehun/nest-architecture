import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointTransaction } from './entities/point-transaction.entity';
import { TotalPoint } from './entities/total-point.entity';
import { PointRepository } from './point.repository';
import { ChargePointUsecase } from './usecase/charge/charge-point.usecase';
import { UsePointUsecase } from './usecase/use/use-point.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([TotalPoint, PointTransaction])],
  providers: [PointRepository, UsePointUsecase, ChargePointUsecase],
})
export class PointModule {}
