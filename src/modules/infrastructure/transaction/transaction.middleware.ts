import { Injectable, NestMiddleware } from '@nestjs/common';
import { createNamespace, getNamespace } from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { TRANSACTION_MANAGER } from './transaction.manager';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private readonly entityManager: EntityManager) {}
  use(req: Request, res: Response, next: NextFunction) {
    // 1. 네임스페이스를 가져온다. 없으면 생성한다.
    const namespace =
      getNamespace(TRANSACTION_NAMESPACE) ??
      createNamespace(TRANSACTION_NAMESPACE);

    // 2. 네임스페이스를 실행하고 트랜젝션 매니저를 세팅한 다음 next()를 실행한다.
    return namespace.runAndReturn(async (): Promise<void> => {
      await Promise.resolve();
      this.setEntityManager();
      next();
    });
  }

  private setEntityManager() {
    const namespace =
      getNamespace(TRANSACTION_NAMESPACE) ??
      createNamespace(TRANSACTION_NAMESPACE);

    namespace.set(TRANSACTION_MANAGER, this.entityManager);
  }
}

export const TRANSACTION_NAMESPACE = 'TRANSACTION_NAMESPACE';
