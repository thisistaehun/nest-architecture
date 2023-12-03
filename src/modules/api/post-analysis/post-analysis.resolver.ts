import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostAnalysisInput } from './dto/post-analysis.input';
import { PostDetail } from './entities/post-detail.entity';
import { CreateManuscriptUsecase } from './usecase/create.manuscript.usecase';
import { PostAnalysisUsecase } from './usecase/post-analysis.usecase';

@Resolver()
export class PostAnalysisResolver {
  constructor(
    private readonly postAnalysisUsecase: PostAnalysisUsecase,
    private readonly createManuscriptUsecase: CreateManuscriptUsecase,
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
    description: '본문 분석 원고 만들기',
  })
  public async createManuscript(
    @Args('text') text: string,
    @Args('keywords', { type: () => [String] }) keywords: string[],
  ): Promise<string> {
    return this.createManuscriptUsecase.execute(text, keywords);
  }
}
