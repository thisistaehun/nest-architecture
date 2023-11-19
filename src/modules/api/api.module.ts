import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { CompetitionAnalysisModule } from './competition-analysis/competition-analysis.module';
import { PaymentModule } from './payment/payment.module';
import { PointModule } from './point/point.module';
import { UserRankPolicyModule } from './policy/user-rank.policy.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    PointModule,
    ProductModule,
    UserRankPolicyModule,
    PaymentModule,
    CompetitionAnalysisModule,
    PuppeteerModule.forRoot(
      {
        pipe: true,
      },
      'BrowserInstanceName',
    ),
  ],
})
export class ApiModule {}
