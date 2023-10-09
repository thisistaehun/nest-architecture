import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVariables } from './modules/infrastructure/config/env-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envVariables.SERVER_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
