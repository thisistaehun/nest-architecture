import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envVariables } from 'src/modules/infrastructure/config/env-config';

@Injectable()
export class SmartBlockUsecase {
  async execute(keyword: string) {
    const result = await axios.post(
      'https://api.datalab.tools/api/sdk/fetch/search/smart/block',
      {
        args: [keyword],
      },
      {
        headers: {
          Authorization: `Bearer ${envVariables.API_DATA_LAB_TOKEN}`,
        },
      },
    );

    return result.data;
  }
}
