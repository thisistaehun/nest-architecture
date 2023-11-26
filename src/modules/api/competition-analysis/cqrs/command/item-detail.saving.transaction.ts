import { Inject, Injectable } from "@nestjs/common";
import { DgLoggerImpl } from "src/modules/infrastructure/logger/logger.implement";
import { DG_LOGGER } from "src/symbols";
import { EntityManager } from "typeorm";
import { SearchKeywordDetail } from "../../entities/search/search.keyword.detail.entity";

@Injectable()
export class ItemDetailSavingTransaction {
    constructor(
        private readonly entityManager: EntityManager,
        @Inject(DG_LOGGER)
        private readonly logger:DgLoggerImpl
    ) { }
    
    async execute(detail: SearchKeywordDetail) {
        const result = await this.entityManager.save(SearchKeywordDetail, detail);
        this.logger.log(`Successfully save detail`)
        return result;
    }
}