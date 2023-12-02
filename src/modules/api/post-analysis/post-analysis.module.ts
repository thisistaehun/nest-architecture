import { Module } from '@nestjs/common';
import { PostAnalysisResolver } from './post-analysis.resolver';
import { PostAnalysisUsecase } from './usecase/post-analysis.usecase';

@Module({
  providers: [PostAnalysisUsecase, PostAnalysisResolver],
})
export class PostAnalysisModule {}
