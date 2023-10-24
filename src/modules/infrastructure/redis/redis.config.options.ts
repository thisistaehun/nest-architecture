import { RedisOptions } from 'ioredis';

export interface RedisConfigOptions extends RedisOptions {
  host: string;
  port: number;
  password: string;
}
