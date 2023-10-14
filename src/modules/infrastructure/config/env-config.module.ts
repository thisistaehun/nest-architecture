import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configOptions } from './env-config.option';

@Module({})
export class EnvConfigModule {
  static forRoot() {
    return {
      module: EnvConfigModule,
      imports: [ConfigModule.forRoot(configOptions)],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
