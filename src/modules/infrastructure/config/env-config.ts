import * as dotenv from 'dotenv';
import * as path from 'path';
import { getEnvVariables } from './get.env-variables';

const ENV = process.env.NODE_ENV;
dotenv.config({
  path: path.resolve(process.cwd(), `config/.env.${ENV}`),
});

export const envVariables = getEnvVariables();
