import { LogType } from './logstash.field.log-type';

export type LogstashResponseField = {
  logType: LogType;
  statusCode: number;
  timeTaken: string;
  responseBody: object;
};
