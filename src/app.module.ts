import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { PaymentModule } from './modules/api/payment/payment.module';
import { PointModule } from './modules/api/point/point.module';
import { ProductModule } from './modules/api/product/product.module';
import { UserModule } from './modules/api/user/user.module';
import { AuthModule } from './modules/infrastructure/auth/auth.module';
import { AwsModule } from './modules/infrastructure/aws/aws.module';
import { EnvConfigModule } from './modules/infrastructure/config/env-config.module';
import { DatabaseModule } from './modules/infrastructure/database/database.module';
import { gqlModuleAsyncOptions } from './modules/infrastructure/graphql/graphql.config';
import { LoggerModule } from './modules/infrastructure/logger/logger.module';
import { LoggerMiddleware } from './modules/infrastructure/logger/logging.middleware';
import { TransactionMiddleware } from './modules/infrastructure/transaction/transaction.middleware';
import { TransactionModule } from './modules/infrastructure/transaction/transaction.module';

@Module({
  imports: [
    EnvConfigModule.forRoot(),
    GraphQLModule.forRootAsync(gqlModuleAsyncOptions),
    DatabaseModule,
    UserModule,
    PointModule,
    AuthModule,
    AwsModule,
    TransactionModule,
    PaymentModule,
    LoggerModule,
    ProductModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
