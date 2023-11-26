import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { PointModule } from './point/point.module';
import { UserRankPolicyModule } from './policy/user-rank.policy.module';
import { ProductModule } from './product/product.module';
import { SearchKeywordModule } from './search-keyword/search-keyword.module';
import { TextAnalysisModule } from './text-analysis/text-analysis.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    PointModule,
    ProductModule,
    UserRankPolicyModule,
    PaymentModule,
    SearchKeywordModule,
    TextAnalysisModule
  ],
})
export class ApiModule {}
