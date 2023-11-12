import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVariables } from './modules/infrastructure/config/env-config';
import { DGLogger } from './modules/infrastructure/logger/logger';
import { DG_LOGGER } from './symbols';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger: DGLogger = app.get(DG_LOGGER);
  app.useLogger(logger);
  app.enableCors({
    origin: true,
  });

  await app.listen(envVariables.SERVER_PORT);
  logger.log(`Server is running on: ${await app.getUrl()}`, 'bootstrap');
}
bootstrap();
