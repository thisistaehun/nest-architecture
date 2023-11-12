import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DG_LOGGER } from 'src/symbols';
import { DgLoggerImpl } from './logger.implement';
import { LoggerUtilHelper } from './logger.util.helper';
import { LoggerMiddleware } from './logging.middleware';
@Global()
@Module({
  providers: [
    LoggerUtilHelper,
    {
      provide: DG_LOGGER,
      inject: [ConfigService, LoggerUtilHelper],
      useFactory: (
        configService: ConfigService,
        loggerUtilHelper: LoggerUtilHelper,
      ) => new DgLoggerImpl(configService, loggerUtilHelper),
    },

    LoggerMiddleware,
  ],
  exports: [DG_LOGGER],
})
export class LoggerModule {}
