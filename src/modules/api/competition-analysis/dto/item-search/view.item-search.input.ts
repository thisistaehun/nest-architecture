import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ViewItemSearchInput {
  @Field(() => String, {
    description: '검색어',
  })
  keyword: string;

  @Field(() => Number, {
    description: '페이지',
  })
  page: number;

  @Field(() => Boolean, {
    description: '디테일 검색 여부',
    defaultValue: false,
  })
  withDetail: boolean;
}
