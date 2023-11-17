import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { SmartBlockKeywordSearchInput } from '../dto/smart-block.keyword.search.input';
import { ViewSearchKeywordItem } from '../entities/view-search/view-search.keyword-item.entity';

@Injectable()
export class SmartBlockItemSearchUsecase {
  async execute(
    input: SmartBlockKeywordSearchInput,
  ): Promise<ViewSearchKeywordItem[]> {
    const result = await axios.post(
      'https://api.datalab.tools/api/sdk/fetch/search/smart/block/item',
      {
        args: [input.desc, input.bid],
      },
      {
        headers: {
          Authorization: `Bearer ${envVariables.API_DATA_LAB_TOKEN}`,
        },
      },
    );

    return result.data.items;
  }
}
