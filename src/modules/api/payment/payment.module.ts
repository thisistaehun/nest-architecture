import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { RedisModule } from 'src/modules/infrastructure/redis/redis.module';
import { TossPaymentsModule } from 'src/modules/infrastructure/toss-payments/toss.payments.module';
import {
  PAYMENT_COMMAND_REPOSITORY,
  PAYMENT_QUERY_REPOSITORY,
  POINT_CALCULATOR,
  USER_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from 'src/symbols';
import { PointCalculator } from '../point/cqrs/command/point.operation.helper';
import { PointTransaction } from '../point/entities/point-transaction.entity';
import { UserWallet } from '../point/entities/total-point.entity';
import { PointModule } from '../point/point.module';
import { Product } from '../product/entity/product.entity';
import { ProductRepository } from '../product/repository/product.repository';
import { User } from '../user/entities/user.entity';
import { UserCommandRepository } from '../user/repository/command/user.command.repository';
import { UserQueryRepository } from '../user/repository/query/user.query.repository';
import { PaymentCommandRepository } from './cqrs/command/payment.command.repository';
import { PaymentQueryRepository } from './cqrs/query/payment.query.repository';
import { PaymentOrder } from './entities/payment.order.entity';
import { PaymentResolver } from './resolver/payment.resolver';
import { CompletePaymentUsecase } from './usecase/complete.payment.usecase';
import { EnrollPaymentUsecase } from './usecase/enroll.payment.usecase';

@Module({
  imports: [
    PointModule,
    TypeOrmModule.forFeature([
      Product,
      PaymentOrder,
      UserWallet,
      PointTransaction,
      User,
    ]),
    TossPaymentsModule,
    RedisModule.register({
      host: envVariables.REDIS_HOST,
      port: envVariables.REDIS_PORT,
      password: envVariables.REDIS_PASSWORD,
    }),
  ],
  providers: [
    {
      provide: PAYMENT_QUERY_REPOSITORY,
      useClass: PaymentQueryRepository,
    },
    {
      provide: PAYMENT_COMMAND_REPOSITORY,
      useClass: PaymentCommandRepository,
    },
    {
      provide: USER_QUERY_REPOSITORY,
      useClass: UserQueryRepository,
    },
    {
      provide: USER_COMMAND_REPOSITORY,
      useClass: UserCommandRepository,
    },
    {
      provide: POINT_CALCULATOR,
      useClass: PointCalculator,
    },
    EnrollPaymentUsecase,
    CompletePaymentUsecase,
    PaymentResolver,
    ProductRepository,
  ],
})
export class PaymentModule {}
