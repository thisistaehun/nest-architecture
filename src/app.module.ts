import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './modules/api/user/user.module';
import { AuthModule } from './modules/infrastructure/auth/auth.module';
import { EnvConfigModule } from './modules/infrastructure/config/env-config.module';
import { DatabaseModule } from './modules/infrastructure/database/database.module';
import { gqlModuleAsyncOptions } from './modules/infrastructure/graphql/graphql.config';

@Module({
  imports: [
    EnvConfigModule.forRoot(),
    GraphQLModule.forRootAsync(gqlModuleAsyncOptions),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
