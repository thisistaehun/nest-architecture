// core
import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';

// logger
import { NextFunction, Request, Response } from 'express';
import { DG_LOGGER } from 'src/symbols';
import { LogType } from './log.type';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(DG_LOGGER)
    private readonly logger: Logger,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    try {
      let responseTimestamp: number;

      if (this.isHealthCheck(request)) {
        next();
        return;
      }

      if (this.isIntrospectionQuery(request)) {
        next();
        return;
      }

      const requestTimestamp = Date.now();
      this.requestLogging(request);

      const oldWrite = response.write;
      const oldEnd = response.end;
      const chunks: any[] = [];

      response.write = function (...args: any[]): boolean {
        chunks.push(Buffer.from(args[0]));
        oldWrite.apply(response, args);
        return true;
      };

      response.end = function (...args: any[]) {
        if (args[0]) {
          chunks.push(Buffer.from(args[0]));
        }
        responseTimestamp = Date.now();
        return oldEnd.apply(response, args);
      };

      response.on('finish', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        const timeTaken = `${responseTimestamp - requestTimestamp}ms`;
        this.responseLogging(request, response, body, timeTaken);
      });

      next();
    } catch (error) {
      this.logger.error(error, error.stack);
      next();
    }
  }

  private requestLogging(request: Request): void {
    if (
      request.body.query &&
      request.body.operationName &&
      request.body.operationName !== 'IntrospectionQuery'
    ) {
      const ip = this.getClientIp(request);
      const logType = LogType.REQUEST;
      const opertationType = request.body.query.split(' ')[0].toUpperCase();
      this.logger.log(
        `${ip} | ${opertationType} | ${request.body.operationName}`,
        logType,
      );
    }
  }

  private responseLogging(
    request: Request,
    response: Response,
    body: string,
    timeTaken: string,
  ): void {
    if (
      request.body.query &&
      request.body.operationName &&
      request.body.operationName !== 'IntrospectionQuery'
    ) {
      const ip = this.getClientIp(request);
      const opertationType = request.body.query.split(' ')[0].toUpperCase();
      const logType = LogType.RESPONSE;
      this.logger.log(
        `${ip} | ${opertationType} | ${request.body.operationName} | ${timeTaken}`,
        logType,
      );
    }
  }

  private getClientIp(req: Request): string | unknown {
    const ip = req.headers['x-forwarded-for'] || req.headers['host'];
    if (!ip) {
      return 'unknown';
    }
    return ip as string;
  }

  private isIntrospectionQuery(req: Request): boolean {
    if (
      req.body.operationName &&
      req.body.operationName === 'IntrospectionQuery'
    ) {
      return true;
    }
    return false;
  }

  private isHealthCheck(req: Request): boolean {
    return (
      req.originalUrl.includes('health') ||
      req.originalUrl.includes('aliveness')
    );
  }
}
