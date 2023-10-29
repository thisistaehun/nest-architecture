import { Global, Module } from '@nestjs/common';
import { TRANSACTION_MANAGER, TransactionManager } from './transaction.manager';

@Global()
@Module({
  providers: [
    {
      provide: TRANSACTION_MANAGER,
      useClass: TransactionManager,
    },
  ],
  exports: [TRANSACTION_MANAGER],
})
export class TransactionModule {}
