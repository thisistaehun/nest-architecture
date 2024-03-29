import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  POINT_CALCULATOR,
  POINT_COMMAND_REPOSITORY,
  POINT_QUERY_REPOSITORY,
} from 'src/symbols';
import { PointCommandRepository } from './cqrs/command/point.command.repository';
import { PointCalculator } from './cqrs/command/point.operation.helper';
import { PointQueryRepository } from './cqrs/query/point.query.repository';
import { PointTransaction } from './entities/point-transaction.entity';
import { UserWallet } from './entities/total-point.entity';
import { PointResolver } from './point.resolver';
import { PointService } from './point.service';
import { ChargePointUsecase } from './usecase/charge/charge-point.usecase';
import { UsePointUsecase } from './usecase/use/use-point.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserWallet, PointTransaction])],
  providers: [
    {
      provide: POINT_QUERY_REPOSITORY,
      useClass: PointQueryRepository,
    },
    {
      provide: POINT_COMMAND_REPOSITORY,
      useClass: PointCommandRepository,
    },
    {
      provide: POINT_CALCULATOR,
      useClass: PointCalculator,
    },
    PointService,
    UsePointUsecase,
    ChargePointUsecase,
    PointResolver,
    Logger,
  ],

  exports: [PointService, POINT_QUERY_REPOSITORY, POINT_COMMAND_REPOSITORY],
})
export class PointModule {}
