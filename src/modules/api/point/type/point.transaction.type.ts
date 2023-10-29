import { registerEnumType } from '@nestjs/graphql';

export enum PointTransactionType {
  CHARGE = 'CHARGE',
  USE = 'USE',
}

registerEnumType(PointTransactionType, {
  name: 'PointTransactionType',
  description: '포인트 트랜잭션 타입',
});
