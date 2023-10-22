import { Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';

@Injectable()
export class AwsSnsService {
  private SNSClient: SNS;
  constructor() {
    this.SNSClient = new SNS({
      region: 'ap-northeast-1',
    });
  }

  async sendMessage(phoneNumber: string, message: string) {
    const publish = await this.SNSClient.publish({
      Message: message,
      PhoneNumber: phoneNumber,
    }).promise();

    return publish;
  }
}
