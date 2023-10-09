import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { envVariables } from '../../config/env-config';

const getTypeOrmModuleOptions = (): TypeOrmModuleOptions => {
  console.log(path.resolve(__dirname, '../../../**/*.entity{.ts,.js}'));
  return {
    type: 'mysql',
    host: envVariables.DATABASE_HOST,
    port: Number(envVariables.DATABASE_PORT),
    username: envVariables.DATABASE_USER,
    password: envVariables.DATABASE_PASSWORD,
    database: envVariables.DATABASE_NAME,
    entities: [path.resolve(__dirname, '../../../**/*.entity{.ts,.js}')],
    migrations: [path.resolve(__dirname, '../../../migrations/*{.ts,.js}')],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
    charset: 'utf8mb4',
    logging: ['error', 'warn', 'migration'],
    logger: 'file',
    timezone: '+00:00',
  };
};

export const typeOrmModuleOptions = getTypeOrmModuleOptions();
