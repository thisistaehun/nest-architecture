import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { EnvConfigModule } from './config/env-config.module';
import { DatabaseModule } from './database/database.module';
import { ExceptionModule } from './exception/exception.module';
import { gqlModuleAsyncOptions } from './graphql/graphql.config';
import { LoggerModule } from './logger/logger.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    EnvConfigModule.forRoot(),
    GraphQLModule.forRootAsync(gqlModuleAsyncOptions),
    DatabaseModule,
    AuthModule,
    AwsModule,
    TransactionModule,
    LoggerModule,
    ExceptionModule,
  ],
})
export class InfrastructureModule {}
