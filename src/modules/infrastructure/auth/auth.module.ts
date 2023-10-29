import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';

import { JwtAccessGuard } from './guard/jwt.access.guard';
import { JwtAuthService } from './service/jwt.auth.service';
import { JwtAccessStrategy } from './stategy/jwt.strategy';

@Module({
  imports: [JwtModule, RedisModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    JwtAccessStrategy,
    JwtAuthService,
  ],
  exports: [JwtModule, JwtAuthService],
})
export class AuthModule {}
