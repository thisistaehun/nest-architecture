import { Global, Module } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { envVariables } from '../../config/env-config';

@Global()
@Module({})
export class AwsCredentialModule {
  constructor() {
    const accessKeyId = envVariables.AWS_ACCESS_KEY_ID;
    const secretAccessKey = envVariables.AWS_SECRET_ACCESS_KEY;
    const region = envVariables.AWS_REGION;

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new Error('AWS credentials are not set');
    }

    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region,
    });
  }
}
