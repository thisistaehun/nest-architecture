import { EnvVariables } from './type/env-variables';

export const getEnvVariables = (): EnvVariables => {
  const env = process.env;

  const variables: EnvVariables = {
    // SERVER
    NODE_ENV: env.NODE_ENV,
    SERVER_PORT: env.SERVER_PORT,

    // DATABASE
    DATABASE_TYPE: env.DATABASE_TYPE,
    DATABASE_HOST: env.DATABASE_HOST,
    DATABASE_PORT: env.DATABASE_PORT,
    DATABASE_NAME: env.DATABASE_NAME,
    DATABASE_USER: env.DATABASE_USER,
    DATABASE_PASSWORD: env.DATABASE_PASSWORD,

    // REDIS
    REDIS_HOST: env.REDIS_HOST,
    REDIS_PORT: Number(env.REDIS_PORT),
    REDIS_PASSWORD: env.REDIS_PASSWORD,

    // JWT
    JWT_ACCESS_TOKEN_SECRET: env.JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET: env.JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN: env.JWT_ACCESS_TOKEN_EXPIRES_IN,

    // OAUTH
    KAKAO_GET_PROFILE_URL: env.KAKAO_GET_PROFILE_URL,
    NAVER_GET_PROFILE_URL: env.NAVER_GET_PROFILE_URL,
    GOOGLE_GET_PROFILE_URL: env.GOOGLE_GET_PROFILE_URL,

    // AWS
    AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: env.AWS_REGION,
  };

  checkUndefinedVars();

  return variables;

  function checkUndefinedVars() {
    const undefinedVariables = Object.entries(variables).filter(
      ([, value]) => value === undefined,
    );
    if (undefinedVariables.length > 0) {
      throw new Error(
        `There are undefined variables: ${undefinedVariables
          .map(([key]) => key)
          .join(', ')}`,
      );
    }
  }
};
