import { LogType } from './logstash.field.log-type';

export type LogstashRequestField = {
  logType: LogType;
  requestBody: object;
};
