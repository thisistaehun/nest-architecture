import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PostAnalysisInput {
  @Field(() => [String], {
    description: '분석할 키워드 배열',
  })
  keywords: string[];

  @Field(() => [String], {
    description: '분석할 포스트 URL',
  })
  postUrls: string[];
}
