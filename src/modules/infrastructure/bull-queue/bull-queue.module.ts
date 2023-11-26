import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { envVariables } from '../config/env-config';
import { queueOption } from './bull-queue.options';

@Module({
  imports: [
    BullModule.forRoot({
      defaultJobOptions: queueOption,
      redis: {
        host: envVariables.REDIS_HOST,
        port: envVariables.REDIS_PORT,
        password: envVariables.REDIS_PASSWORD,
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
  ],
})
export class BullManagerModule {}
