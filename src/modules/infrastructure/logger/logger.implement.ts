import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { DGLogger } from './logger';

import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../config/type/env-variables';
import { LoggerUtilHelper } from './logger.util.helper';

@Injectable()
export class DgLoggerImpl implements DGLogger {
  private readonly logger: winston.Logger;
  constructor(
    private readonly configService: ConfigService<EnvVariables>,
    private readonly loggerUtilHelper: LoggerUtilHelper,
  ) {
    const env = this.configService.get('NODE_ENV');
    this.logger = winston.createLogger(
      this.loggerUtilHelper.getLoggerOptions(env),
    );
  }
  log<T>(message: string, context?: T): void {
    this.logger.log('info', message, { context });
  }
  error<T>(message: string, trace?: string, context?: T): void {
    this.logger.log('error', message, { context, trace });
  }
  warn<T>(message: string, context?: T): void {
    this.logger.log('warn', message, { context });
  }
  debug<T>(message: string, context?: T): void {
    this.logger.log('debug', message, { context });
  }
  verbose<T>(message: string, context?: T): void {
    this.logger.log('verbose', message, { context });
  }
}
