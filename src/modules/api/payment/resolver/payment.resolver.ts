import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { Roles } from 'src/modules/infrastructure/auth/decorator/roles.decorator';
import { UserAuth } from '../../user/type/user.auth.type';
import { UserRole } from '../../user/type/user.role';
import { CompletePaymentInput } from '../dto/input/complete/complete.payment.input';
import { EnrollPaymentInput } from '../dto/input/enroll/enroll.payment.input';
import { CompletePaymentOutput } from '../dto/output/complete.payment.output';
import { EnrollPaymentOutput } from '../dto/output/enroll.payment.output';
import { CompletePaymentUsecase } from '../usecase/complete.payment.usecase';
import { EnrollPaymentUsecase } from '../usecase/enroll.payment.usecase';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly enrollPaymentUsecase: EnrollPaymentUsecase,
    private readonly orderProductUsecase: CompletePaymentUsecase,
  ) {}

  @Roles(UserRole.FREE_USER)
  @Mutation(() => EnrollPaymentOutput, {
    description:
      '결제 전 고객의 결제 정보를 등록합니다. 주문 ID 및 결제 수단, 결제 상품을 입력합니다.',
  })
  async enrollPayment(
    @Args('input') input: EnrollPaymentInput,
    @CurrentUser('userAuth') userAuth: UserAuth,
  ) {
    return this.enrollPaymentUsecase.execute(input, userAuth);
  }

  @Roles(UserRole.FREE_USER)
  @Mutation(() => CompletePaymentOutput, {
    description: '결제를 완료합니다. ',
  })
  async completePayment(
    @Args('input') input: CompletePaymentInput,
    @CurrentUser('userAuth') userAuth: UserAuth,
  ) {
    return this.orderProductUsecase.execute(input, userAuth);
  }
}
