import { Module } from '@nestjs/common';
import { TOSS_PAYMENTS_PROVIDER } from 'src/symbols';
import { TossPaymentsProvider } from './toss-payments.provider';

@Module({
  providers: [
    {
      provide: TOSS_PAYMENTS_PROVIDER,
      useClass: TossPaymentsProvider,
    },
  ],
  exports: [TOSS_PAYMENTS_PROVIDER],
})
export class TossPaymentsModule {}
