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
}
