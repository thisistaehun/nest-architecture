import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVariables } from './modules/infrastructure/config/env-config';
import { DG_LOGGER } from './symbols';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger: Logger = app.get(DG_LOGGER) as Logger;
  app.useLogger(logger);
  app.enableCors();

  await app.listen(envVariables.SERVER_PORT);
  logger.log(`Server is running on: ${await app.getUrl()}`, 'bootstrap');
}
bootstrap();
