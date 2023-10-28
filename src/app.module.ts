import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './modules/api/user/user.module';
import { AuthModule } from './modules/infrastructure/auth/auth.module';
import { AwsModule } from './modules/infrastructure/aws/aws.module';
import { EnvConfigModule } from './modules/infrastructure/config/env-config.module';
import { DatabaseModule } from './modules/infrastructure/database/database.module';
import { gqlModuleAsyncOptions } from './modules/infrastructure/graphql/graphql.config';
import { TransactionMiddleware } from './modules/infrastructure/transaction/transaction.middleware';

@Module({
  imports: [
    EnvConfigModule.forRoot(),
    GraphQLModule.forRootAsync(gqlModuleAsyncOptions),
    DatabaseModule,
    UserModule,
    AuthModule,
    AwsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }
}
