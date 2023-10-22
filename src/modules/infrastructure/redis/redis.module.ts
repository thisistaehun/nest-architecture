import { DynamicModule, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisConfigOptions } from './redis.config.options';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  public static register(config: RedisConfigOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: 'REDIS',
          useFactory: () => {
            return new Redis(config);
          },
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
