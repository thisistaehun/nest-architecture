import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Queue } from 'bull';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { ItemSearchJobData as IViewItemSearchJob } from '../consumer/item-search.job.data.type';
import { ViewItemSearchInput } from '../dto/item-search/view.item-search.input';
import { SearchKeywordItem } from '../entities/search/search.keyword-item.entity';

@Injectable()
export class ItemSearchUsecase {
  constructor(@InjectQueue('item-search') private queue: Queue) {}
  async execute(
    input: ViewItemSearchInput,
    userCode: string,
  ): Promise<SearchKeywordItem[]> {
    const { keyword, page } = input;
    const viewGeneral = await axios.post(
      'https://api.datalab.tools/api/sdk/fetch/search/view/normal',
      {
        args: [keyword, { start: page }],
      },
      {
        headers: {
          Authorization: `Bearer ${envVariables.API_DATA_LAB_TOKEN}`,
        },
      },
    );


    const items = viewGeneral.data.items.slice(
      0,
      10,
    ) as SearchKeywordItem[];

    const job: IViewItemSearchJob = {
      name: keyword,
      items,
      userCode,
    };

    await this.queue.add('item-search', job);

    return items;
  }
}
