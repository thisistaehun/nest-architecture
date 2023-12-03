import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { DgLoggerImpl } from 'src/modules/infrastructure/logger/logger.implement';
import { DG_LOGGER } from 'src/symbols';
import { ItemDetailSavingTransaction } from '../cqrs/command/item-detail.saving.transaction';

@Processor('item-detail')
export class ItemDetailSavingConsumer {
  constructor(
    @Inject(DG_LOGGER)
    private readonly logger: DgLoggerImpl,
    private readonly itemDetailSavingTransaction: ItemDetailSavingTransaction,
  ) {}

  @Process('item-detail-saving')
  async execute(job: Job) {
    this.logger.log(`Successfully consume detail`);
    await this.itemDetailSavingTransaction.execute(job.data.detail);
  }
}
