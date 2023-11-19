import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BullManagerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // login UI 만들기
    const acceptedClientHosts = ['localhost'];
    const ip = this.getClientIp(req);
    let isAccepted = false;

    acceptedClientHosts.forEach((host) => {
      if (ip.includes(host)) {
        isAccepted = true;
      }
    });

    if (isAccepted) {
      next();
      return;
    } else {
      res.status(403).send('403 Forbidden');
      return;
    }
  }

  private getClientIp(req: Request): string {
    const ip = req.headers['x-forwarded-for'] || req.headers['host'];
    if (!ip) {
      return 'unknown';
    }
    return ip as string;
  }
}
