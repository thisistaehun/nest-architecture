import { EnvVariables } from './type/env-variables';

export const getEnvVariables = (): EnvVariables => {
  const env = process.env;

  return {
    NODE_ENV: env.NODE_ENV,
    SERVER_PORT: env.SERVER_PORT,
    DATABASE_TYPE: env.DATABASE_TYPE,
    DATABASE_HOST: env.DATABASE_HOST,
    DATABASE_PORT: env.DATABASE_PORT,
    DATABASE_NAME: env.DATABASE_NAME,
    DATABASE_USER: env.DATABASE_USER,
    DATABASE_PASSWORD: env.DATABASE_PASSWORD,
  };
};
