import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POINT_COMMAND_REPOSITORY, POINT_QUERY_REPOSITORY } from 'src/symbols';
import { PointCommandRepository } from './cqrs/command/point.command.repository';
import { PointQueryRepository } from './cqrs/query/point.query.repository';
import { PointTransaction } from './entities/point-transaction.entity';
import { TotalPoint } from './entities/total-point.entity';
import { ChargePointUsecase } from './usecase/charge/charge-point.usecase';
import { UsePointUsecase } from './usecase/use/use-point.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([TotalPoint, PointTransaction])],
  providers: [
    {
      provide: POINT_QUERY_REPOSITORY,
      useClass: PointQueryRepository,
    },
    {
      provide: POINT_COMMAND_REPOSITORY,
      useClass: PointCommandRepository,
    },
    UsePointUsecase,
    ChargePointUsecase,
  ],
})
export class PointModule {}
