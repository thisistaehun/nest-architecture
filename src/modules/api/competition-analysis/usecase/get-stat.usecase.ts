import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { DgLoggerImpl } from 'src/modules/infrastructure/logger/logger.implement';
import { DG_LOGGER } from 'src/symbols';
import { SearchKeywordStat } from '../entities/search/search-keyword.stat.entity';

@Injectable()
export class GetStatUsecase {
  constructor(
    @Inject(DG_LOGGER)
    private readonly logger: DgLoggerImpl,
  ) {}

  public async execute(keyword: string) {
    try {
      const response = await axios.post(
        'https://api.datalab.tools/api/sdk/fetch/search/ad/rel/kwd/stat/item',
        {
          args: [keyword],
        },
        {
          headers: {
            Authorization: `Bearer ${envVariables.API_DATA_LAB_TOKEN}`,
          },
        },
      );
      this.logger.log(`Successfully get ${keyword} stat`);
      return new SearchKeywordStat(response.data);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
