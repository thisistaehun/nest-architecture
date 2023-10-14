import { EnvVariables } from './type/env-variables';

export const getEnvVariables = (): EnvVariables => {
  const env = process.env;

  const variables: EnvVariables = {
    NODE_ENV: env.NODE_ENV,
    SERVER_PORT: env.SERVER_PORT,
    DATABASE_TYPE: env.DATABASE_TYPE,
    DATABASE_HOST: env.DATABASE_HOST,
    DATABASE_PORT: env.DATABASE_PORT,
    DATABASE_NAME: env.DATABASE_NAME,
    DATABASE_USER: env.DATABASE_USER,
    DATABASE_PASSWORD: env.DATABASE_PASSWORD,
    JWT_ACCESS_TOKEN_SECRET: env.JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET: env.JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
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
