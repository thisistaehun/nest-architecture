import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Queue } from 'bull';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { IViewItemSearchJobData as IViewItemSearchJob } from '../consumer/view.item-search.job.data.type';
import { ViewItemSearchInput } from '../dto/item-search/view.item-search.input';
import { ViewSearchKeywordItem } from '../entities/view-search/view-search.keyword-item.entity';

@Injectable()
export class ViewItemSearchUsecase {
  constructor(@InjectQueue('competition-analysis') private queue: Queue) {}
  async execute(
    input: ViewItemSearchInput,
    userCode: string,
  ): Promise<ViewSearchKeywordItem[]> {
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

    const items = viewGeneral.data.items as ViewSearchKeywordItem[];

    const job: IViewItemSearchJob = {
      name: keyword,
      items,
      userCode,
    };

    await this.queue.add('view-item-search', job);

    return items;
  }
}
