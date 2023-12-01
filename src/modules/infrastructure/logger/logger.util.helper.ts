import { Injectable } from '@nestjs/common';
import * as Winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';

import { LoggerCloudOption } from './types/logger.cloud.option';
import { LoggerFileOption } from './types/logger.file.option';

@Injectable()
export class LoggerUtilHelper {
  public getLoggerOptions(env: string) {
    const date = this.Today();
    this.colorizer();

    if (env === 'local' || env === 'local-docker') {
      return {
        transports: [
          ...this.getTransportsForLocal(date),
          this.getTransportForConsole(env),
        ],
      };
    } else if (env === 'dev' || env === 'test') {
      return {
        transports: [
          ...this.getTransportsForCloud(env, date),
          this.getTransportForConsole(env),
        ],
      };
    } else if (env === 'prod') {
      return {
        transports: [...this.getTransportsForCloud(env, date)],
      };
    } else {
      throw new Error('Invalid Environment');
    }
  }

  private getTransportsForLocal(
    date: string,
  ): Winston.transports.FileTransportInstance[] {
    const loggerFileOptions: LoggerFileOption[] = [
      this.localLogFileFormatter('error', date),
      this.localLogFileFormatter('info', date),
      this.localLogFileFormatter('debug', date),
    ];

    return loggerFileOptions.map((option) => {
      return new Winston.transports.File(this.createFileTransports(option));
    });
  }

  private getTransportsForCloud(
    env: string,
    date: string,
  ): WinstonCloudWatch[] {
    const loggerCloudOptions: LoggerCloudOption[] = [
      this.cloudLogFileFormatter(env, 'error', date),
      this.cloudLogFileFormatter(env, 'info', date),
      this.cloudLogFileFormatter(env, 'debug', date),
    ];

    return loggerCloudOptions.map((option) => {
      return this.createCloudTransports(env, option.level, option.logGroupName);
    });
  }

  private getTransportForConsole(env: string) {
    const level = env === 'prod' ? 'info' : 'debug';
    return new Winston.transports.Console({
      level,
      format: Winston.format.combine(
        Winston.format.colorize({
          all: true,
        }),
        Winston.format.errors({ stack: true }),
        Winston.format.timestamp({ format: 'isoDateTime' }),
        Winston.format.printf((info: Winston.Logform.TransformableInfo) => {
          return `[dg-server] [${env}] ${info.message} ${info.timestamp
            .slice(0, 19)
            .replace('T', ' ')}`;
        }),
      ),
    });
  }

  private localLogFileFormatter(level: string, date: string) {
    return {
      level,
      filename: `${date}.log`,
      dirname: `logs/${level}`,
    };
  }

  private cloudLogFileFormatter(env: string, level: string, date: string) {
    return {
      level,
      logGroupName: `${date}.log`,
      logStreamName: `logs/dg-${env}-${level}-log`,
    };
  }

  private createCloudTransports(env: string, level: string, date: string) {
    return new WinstonCloudWatch({
      level,
      logGroupName: `dg-${env}-${level}-log`,
      logStreamName: date,
    });
  }

  private createFileTransports({ level, filename, dirname }: LoggerFileOption) {
    return {
      level,
      filename,
      dirname,
      maxsize: 5000000,
      format: Winston.format.combine(
        Winston.format.timestamp({ format: 'isoDateTime' }),
      ),
    };
  }

  private colorizer() {
    const colors = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'blue',
    };

    Winston.addColors(colors);
  }

  private Today() {
    return new Date().toISOString().slice(0, 10);
  }
}
