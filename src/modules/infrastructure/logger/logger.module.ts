import { Global, Logger, Module } from '@nestjs/common';
import { DG_LOGGER } from 'src/symbols';
@Global()
@Module({
  providers: [
    {
      provide: DG_LOGGER,
      useClass: Logger,
    },
  ],
  exports: [DG_LOGGER],
})
export class LoggerModule {}
