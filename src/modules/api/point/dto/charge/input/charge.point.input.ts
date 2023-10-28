import { Field, InputType, Int } from '@nestjs/graphql';
import { PointType } from '../../../type/point.type';

@InputType()
export class ChargePointInput {
  @Field(() => Int, {
    description: '충전 포인트 금액입니다.',
    nullable: false,
  })
  amount: number;

  @Field(() => Int, {
    description: '충전 포인트 타입입니다. 기본값은 무료 포인트입니다.',
    nullable: false,
    defaultValue: PointType.FREE,
  })
  type: PointType;
}
