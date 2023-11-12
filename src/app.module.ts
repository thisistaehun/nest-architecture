import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './modules/api/api.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';
import { LoggerMiddleware } from './modules/infrastructure/logger/logging.middleware';
import { TransactionMiddleware } from './modules/infrastructure/transaction/transaction.middleware';

@Module({
  imports: [InfrastructureModule, ApiModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
