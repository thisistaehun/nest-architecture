import { Injectable } from '@nestjs/common';
import { NotFoundCustomException } from 'src/modules/common/exception/not-found.exception';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import { ProductRepository } from '../../product/repository/product.repository';
import { UserAuth } from '../../user/type/user.auth.type';
import { EnrollPaymentInput } from '../dto/input/enroll/enroll.payment.input';

@Injectable()
export class EnrollPaymentUsecase {
  constructor(
    private readonly redisService: RedisService,
    private readonly productRepository: ProductRepository,
  ) {}
  public async execute(input: EnrollPaymentInput, userAuth: UserAuth) {
    const targetProduct = await this.productRepository.findByCode(
      input.productCode,
    );

    if (!targetProduct) {
      throw new NotFoundCustomException('Product not found');
    }

    const { paymentMethod, orderId } = input;
    const userCode = userAuth.code;
    const key = `payment:${userCode}`;

    const paymentEnrollment = await this.redisService.set<EnrollPaymentInput>(
      key,
      input,
      1000 * 60 * 15,
    );

    if (!paymentEnrollment) {
      throw new Error('Payment enrollment failed');
    }

    return {
      success: true,
      message: '결제 준비가 완료되었습니다. 15분 안에 결제를 완료해주세요.',
      data: {
        paymentMethod,
        orderId,
      },
    };
  }
}
