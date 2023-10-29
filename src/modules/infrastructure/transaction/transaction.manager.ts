import { Injectable } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import { EntityManager } from 'typeorm';
import { TRANSACTION_NAMESPACE } from './transaction.middleware';

@Injectable()
export class TransactionManager {
  getEntityManager(): EntityManager {
    const nameSpace = getNamespace(TRANSACTION_NAMESPACE);
    if (!nameSpace || !nameSpace.active)
      throw new Error('No active namespace found(Transaction Manager)');
    return nameSpace.get(TRANSACTION_MANAGER) as EntityManager;
  }
}
export const TRANSACTION_MANAGER = 'TRANSACTION_MANAGER';
