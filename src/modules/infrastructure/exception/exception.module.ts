import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLExceptionFilter } from './exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
  exports: [],
})
export class ExceptionModule {}
