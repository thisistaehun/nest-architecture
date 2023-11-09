import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject('REDIS')
    private redis: Redis,
  ) {}

  async onModuleDestroy() {
    await this.redis.quit().then(() => console.log('Redis connection closed'));
  }

  async get<T>(key: string, json = true): Promise<T | null> {
    const data = (await this.redis.get(key)) as string;

    if (!data) {
      return null;
    }
    if (json) {
      return JSON.parse(data);
    }
    return data as unknown as T;
  }

  async getOrFail<T>(key: string, json = true): Promise<T> {
    const data = await this.get<T>(key, json);
    if (!data) {
      throw new Error(`Redis key ${key} not found`);
    }
    return data;
  }

  async set<T>(key: string, data: T, ttl: number): Promise<T> {
    const stringifiedData = JSON.stringify(data);
    await this.redis.set(key, stringifiedData, 'PX', ttl); // EX: seconds, PX: milliseconds
    return this.get<T>(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async reset(): Promise<void> {
    const keys = await this.keys('*');
    await this.redis.del(...keys);
  }

  async mset(args: [string, unknown][], ttl: number): Promise<void> {
    await this.redis.multi().mset(args).expire(args[0][0], ttl).exec();
  }

  async mget<T>(...keys: string[]): Promise<T[]> {
    const data = (await this.redis.mget(...keys)) as string[];
    if (data.length === 0) {
      return [];
    }

    return data.map((d) => JSON.parse(d)) as T[];
  }
}
