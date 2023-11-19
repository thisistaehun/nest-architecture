import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { DgLoggerImpl } from 'src/modules/infrastructure/logger/logger.implement';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from 'src/modules/infrastructure/transaction/transaction.manager';
import { DG_LOGGER } from 'src/symbols';
import { ViewSearchCommandRepository } from '../cqrs/view-search.command.repository';
import { SearchKeyword } from '../entities/keyword/keyword.entity';

@Processor('competition-analysis')
export class ViewItemSearchConsumer {
  constructor(
    @Inject(DG_LOGGER)
    private readonly logger: DgLoggerImpl,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
    private readonly viewSearchCommandRepository: ViewSearchCommandRepository,
  ) {}

  @Process('view-item-search')
  async execute(job: Job) {
    const keywordEntity = new SearchKeyword(job.data);
    await this.viewSearchCommandRepository.saveKeyword(
      keywordEntity,
      job.data.userCode,
    );
  }
}
