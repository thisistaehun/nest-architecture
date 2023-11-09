import { Module } from '@nestjs/common';
import { TossPaymentsProvider } from './toss-payments.provider';

@Module({
  providers: [TossPaymentsProvider],
})
export class TossPaymentsModule {}
