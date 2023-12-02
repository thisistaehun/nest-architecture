import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { PointModule } from './point/point.module';
import { UserRankPolicyModule } from './policy/user-rank.policy.module';
import { PostAnalysisModule } from './post-analysis/post-analysis.module';
import { ProductModule } from './product/product.module';
import { SearchKeywordModule } from './search-keyword/search-keyword.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    PointModule,
    ProductModule,
    UserRankPolicyModule,
    PaymentModule,
    SearchKeywordModule,
    PostAnalysisModule,
  ],
})
export class ApiModule {}
