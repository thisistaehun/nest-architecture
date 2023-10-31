import { Global, Logger, Module } from '@nestjs/common';
import { DG_LOGGER } from 'src/symbols';
import { LoggerMiddleware } from './logging.middleware';
@Global()
@Module({
  providers: [
    {
      provide: DG_LOGGER,
      useClass: Logger,
    },
    LoggerMiddleware,
  ],
  exports: [DG_LOGGER],
})
export class LoggerModule {}
