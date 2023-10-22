import { Module } from '@nestjs/common';
import { AwsCredentialModule } from './credential/aws.credential.module';
import { AwsSesModule } from './ses/aws.sns.module';

@Module({
  imports: [AwsCredentialModule, AwsSesModule],
  exports: [AwsCredentialModule, AwsSesModule],
})
export class AwsModule {}
