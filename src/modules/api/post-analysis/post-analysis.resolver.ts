import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostAnalysisInput } from './dto/post-analysis.input';
import { PostDetail } from './entities/post-detail.entity';
import { PostAnalysisUsecase } from './usecase/post-analysis.usecase';

@Resolver()
export class PostAnalysisResolver {
  constructor(private readonly postAnalysisUsecase: PostAnalysisUsecase) {}
  @Mutation(() => [PostDetail], {
    description: '본문 분석',
  })
  public async postAnalysis(
    @Args('input') input: PostAnalysisInput,
  ): Promise<PostDetail[]> {
    return this.postAnalysisUsecase.execute(input);
  }
}
