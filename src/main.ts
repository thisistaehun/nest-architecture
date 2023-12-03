import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { envVariables } from './modules/infrastructure/config/env-config';
import { DGLogger } from './modules/infrastructure/logger/logger';
import { DG_LOGGER } from './symbols';

async function bootstrap() {
  let isDisableKeepAlive = false;

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger: DGLogger = app.get(DG_LOGGER);
  app.useLogger(logger);
  app.use(function (req: Request, res: Response, next: NextFunction) {
    if (isDisableKeepAlive) {
      res.set('Connection', 'close');
    }
    next();
  });
  app.enableCors({
    origin: true,
  });

  await app.listen(envVariables.SERVER_PORT, function () {
    if (envVariables.NODE_APP_INSTANCE !== undefined) {
      if (envVariables.NODE_APP_INSTANCE === '0') {
        console.log('This is a Master process');
      } else {
        console.log(
          `This is a Worker process with instance ID: ${envVariables.NODE_APP_INSTANCE}`,
        );
        process.send('ready');
      }
    }
    console.log(`application is listening on port ${envVariables.SERVER_PORT}`);
  });

  process.on('SIGINT', function () {
    isDisableKeepAlive = true;
    app.close().then(() => {
      console.log('server closed');
      process.exit(0);
    });
  });
}

bootstrap();
