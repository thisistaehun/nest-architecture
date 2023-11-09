import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  WAITING = 'WAITING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  CANCEL = 'CANCEL',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: '결제 상태',
});
