import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { IUsecase } from 'src/interface/usecase/usecase.interface';
import { BadRequestCustomException } from 'src/modules/common/exception/bad-request.exception';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import {
  DG_LOGGER,
  PAYMENT_COMMAND_REPOSITORY,
  PAYMENT_QUERY_REPOSITORY,
  POINT_COMMAND_REPOSITORY,
  USER_QUERY_REPOSITORY,
} from 'src/symbols';
import { PointCommandRepository } from '../../point/cqrs/command/point.command.repository';
import { Product } from '../../product/entity/product.entity';
import { User } from '../../user/entities/user.entity';
import { UserQueryRepository } from '../../user/repository/query/user.query.repository';
import { UserAuth } from '../../user/type/user.auth.type';
import { UserRank } from '../../user/type/user.rank.type';
import { PaymentCommandRepository } from '../cqrs/command/payment.command.repository';
import { PaymentQueryRepository } from '../cqrs/query/payment.query.repository';
import { CompletePaymentInput } from '../dto/input/complete/complete.payment.input';
import { CompletePaymentOutput } from '../dto/output/complete.payment.output';

@Injectable()
export class CompletePaymentUsecase
  implements IUsecase<CompletePaymentInput, CompletePaymentOutput>
{
  constructor(
    @Inject(PAYMENT_QUERY_REPOSITORY)
    private readonly paymentQueryRepository: PaymentQueryRepository,
    @Inject(PAYMENT_COMMAND_REPOSITORY)
    private readonly paymentCommandRepository: PaymentCommandRepository,
    @Inject(POINT_COMMAND_REPOSITORY)
    private readonly pointCommandRepository: PointCommandRepository,
    @Inject(USER_QUERY_REPOSITORY)
    private readonly userQueryRepository: UserQueryRepository,
    private readonly redisService: RedisService,
    @Inject(DG_LOGGER)
    private readonly logger: Logger,
  ) {}
  async execute(
    input: CompletePaymentInput,
    userAuth: UserAuth,
  ): Promise<CompletePaymentOutput> {
    await this.checkEnrollment(userAuth, input);

    const targetProduct: Product =
      await this.paymentQueryRepository.findOneByCode(input.productCode);

    //TODO1: 토스 페이먼츠 결제 승인
    console.log('결제 승인 완료');

    // TODO2: 주문 등록 및 포인트 충전 트랜젝션(결제 완료 시 포인트 적립)
    const { paidPoints, freePoints } = targetProduct;
    // 1. 유저 등급 확인
    const user: User = await this.userQueryRepository.findOneByCode(
      userAuth.code,
    );
    const userRankReflectedPaidPoint = await this.reflectUserRank(
      user,
      paidPoints,
    );

    // 2. 포인트 적립
    try {
      const paymentOrder =
        await this.paymentCommandRepository.chargePointByPaymentTransaction(
          input,
          user.totalPoint,
          targetProduct,
          freePoints,
          userRankReflectedPaidPoint,
        );

      return {
        success: true,
        message: '결제가 완료되었습니다.',
        paymentOrder,
      };
    } catch (error) {
      this.logger.error(error);
      throw new Error('결제 실패');
      // TODO3: 포인트 적립 실패 시 결제 취소
    }
  }

  private async checkEnrollment(
    userAuth: UserAuth,
    input: CompletePaymentInput,
  ) {
    const savedData = await this.redisService.get<object>(
      `payment:${userAuth.code}`,
    );

    if (!savedData) {
      throw new NotFoundException('등록된 결제 정보가 없습니다. ');
    }

    // TODO: 결제 정보 확인
    await this.compareData(input, savedData);
  }

  private async compareData(input: CompletePaymentInput, savedData: object) {
    const { orderId, paymentMethod: payMethod, productCode } = input;

    const {
      orderId: savedOrderId,
      paymentMethod: savedPayMethod,
      productCode: savedProductCode,
    } = savedData as CompletePaymentInput;
    const orderIdSame = orderId === savedOrderId;
    const payMethodSame = payMethod === savedPayMethod;
    const productCodeSame = productCode === savedProductCode;

    if (!orderIdSame)
      throw new BadRequestCustomException('주문 번호가 일치하지 않습니다.');
    if (!payMethodSame)
      throw new BadRequestCustomException('결제 수단이 일치하지 않습니다.');
    if (!productCodeSame)
      throw new BadRequestCustomException('상품 코드가 일치하지 않습니다.');
  }

  private async reflectUserRank(user: User, paidPoint: number) {
    const { rank } = user;

    switch (rank) {
      case UserRank.UNAUTH:
        throw new BadRequestCustomException(
          '미인증 유저는 결제할 수 없습니다.',
        );
      case UserRank.NORMAL:
        break;
      case UserRank.BEGINNER:
        paidPoint = paidPoint * 1.05;
      case UserRank.AMATEUR:
        paidPoint = paidPoint * 1.1;
      case UserRank.INTERMEDIATE:
        paidPoint = paidPoint * 1.15;
      case UserRank.ADVANCED:
        paidPoint = paidPoint * 1.2;
      case UserRank.EXPERT:
        paidPoint = paidPoint * 1.25;
      default:
        break;
    }

    return paidPoint;
  }
}
