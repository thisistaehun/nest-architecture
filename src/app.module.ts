import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/api/user/user.module';
import { DatabaseModule } from './modules/infrastructure/database/database.module';
import { gqlModuleAsyncOptions } from './modules/infrastructure/graphql/graphql.config';

@Module({
  imports: [
    GraphQLModule.forRootAsync(gqlModuleAsyncOptions),
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
