import { Module } from '@nestjs/common';
import { PostAnalysisResolver } from './post-analysis.resolver';
import { PostAnalysisUsecase } from './usecase/post-analysis.usecase';
import { ShufflePostUsecase } from './usecase/shuffle-post.usecase';

@Module({
  providers: [PostAnalysisUsecase, ShufflePostUsecase, PostAnalysisResolver],
})
export class PostAnalysisModule {}
