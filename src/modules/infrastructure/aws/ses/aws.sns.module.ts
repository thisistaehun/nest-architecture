import { Module } from '@nestjs/common';
import { SNS } from 'aws-sdk';
import { AwsSnsService } from './aws.sns.service';

@Module({
  providers: [
    AwsSnsService,
    {
      provide: 'SNS_CLIENT',
      useClass: SNS,
    },
  ],
  exports: [AwsSnsService],
})
export class AwsSesModule {}
