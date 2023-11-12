import { LoggerService as NestLoggerService } from '@nestjs/common';

export interface DGLogger extends NestLoggerService {
  log<T>(message: string | object, context?: T): void;
  error<T>(message: string, trace?: string, context?: T): void;
  warn<T>(message: string, context?: T): void;
  debug<T>(message: string, context?: T): void;
  verbose<T>(message: string, context?: T): void;
}
export const ONTOL_LOGGER = Symbol('OntolLogger');
