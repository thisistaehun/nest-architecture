export type EnvVariables = {
  // SERVER
  NODE_ENV: string;
  SERVER_PORT: string;

  // DATABASE
  DATABASE_TYPE: string;
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;

  // REDIS
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;

  // JWT
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;

  // OAUTH
  KAKAO_GET_PROFILE_URL: string;
  NAVER_GET_PROFILE_URL: string;
  GOOGLE_GET_PROFILE_URL: string;

  // AWS
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
};
