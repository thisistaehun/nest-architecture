import { Module } from '@nestjs/common';
import { PostAnalysisResolver } from './post-analysis.resolver';
import { CreateManuscriptUsecase } from './usecase/create.manuscript.usecase';
import { PostAnalysisUsecase } from './usecase/post-analysis.usecase';

@Module({
  providers: [
    PostAnalysisUsecase,
    CreateManuscriptUsecase,
    PostAnalysisResolver,
  ],
})
export class PostAnalysisModule {}
