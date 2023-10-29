import { Field, InputType } from '@nestjs/graphql';
import { PointType } from '../../../type/point.type';

@InputType()
export class UsePointInput {
  @Field(() => Number, {
    nullable: false,
    description: '사용 포인트 금액',
  })
  amount: number;

  @Field(() => PointType, {
    description: '사용 포인트 타입입니다. 기본값은 무료 포인트입니다.',
    nullable: false,
    defaultValue: PointType.FREE,
  })
  type: PointType;
}
