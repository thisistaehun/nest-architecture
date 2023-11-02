import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/infrastructure/auth/decorator/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('health-check')
  healthCheck() {
    return { success: true, status: 200, timestamp: new Date().toISOString() };
  }
}
