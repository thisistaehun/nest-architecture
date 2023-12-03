import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostAnalysisInput } from './dto/post-analysis.input';
import { PostDetail } from './entities/post-detail.entity';
import { PostAnalysisUsecase } from './usecase/post-analysis.usecase';
import { ShufflePostUsecase } from './usecase/shuffle-post.usecase';

@Resolver()
export class PostAnalysisResolver {
  constructor(
    private readonly postAnalysisUsecase: PostAnalysisUsecase,
    private readonly shufflePostUsecase: ShufflePostUsecase,
  ) {}
  @Mutation(() => [PostDetail], {
    description: '본문 분석',
  })
  public async postAnalysis(
    @Args('input') input: PostAnalysisInput,
  ): Promise<PostDetail[]> {
    return this.postAnalysisUsecase.execute(input);
  }

  @Mutation(() => String, {
    description: '본문 분석 (shuffle)',
  })
  public async shufflePost(
    @Args('text') text: string,
    @Args('keywords', { type: () => [String] }) keywords: string[],
  ): Promise<string> {
    return this.shufflePostUsecase.execute(text, keywords);
  }
}
