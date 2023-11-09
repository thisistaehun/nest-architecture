import { registerEnumType } from '@nestjs/graphql';

export enum PaymentPolicyType {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

registerEnumType(PaymentPolicyType, {
  name: 'PaymentPolicyType',
  description: '결제 정책 타입',
});
