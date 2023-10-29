import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PointModule } from './modules/api/point/point.module';
import { UserModule } from './modules/api/user/user.module';
import { AuthModule } from './modules/infrastructure/auth/auth.module';
import { AwsModule } from './modules/infrastructure/aws/aws.module';
import { EnvConfigModule } from './modules/infrastructure/config/env-config.module';
import { DatabaseModule } from './modules/infrastructure/database/database.module';
import { gqlModuleAsyncOptions } from './modules/infrastructure/graphql/graphql.config';
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }
}
