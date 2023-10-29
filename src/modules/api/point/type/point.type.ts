import { registerEnumType } from '@nestjs/graphql';

export enum PointType {
  FREE = 'FREE',
  PAID = 'PAID',
}

registerEnumType(PointType, {
  description: '포인트 타입입니다.',
  name: 'PointType',
});
