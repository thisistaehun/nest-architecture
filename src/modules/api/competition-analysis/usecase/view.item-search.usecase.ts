import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { ViewSearchKeywordItem } from '../entities/view-search/view-search.keyword-item.entity';

@Injectable()
export class ViewItemSearchUsecase {
  async execute(keyword: string): Promise<ViewSearchKeywordItem[]> {
    const viewGeneral = await axios.post(
      'https://api.datalab.tools/api/sdk/fetch/search/view/normal',
      {
        args: [keyword, { start: 1 }],
      },
      {
        headers: {
          Authorization: `Bearer ${envVariables.API_DATA_LAB_TOKEN}`,
        },
      },
    );

    return viewGeneral.data.items;
  }
}
