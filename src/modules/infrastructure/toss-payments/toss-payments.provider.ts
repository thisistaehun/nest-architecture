import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DG_LOGGER } from 'src/symbols';
import { envVariables } from '../config/env-config';
import { DGLogger } from '../logger/logger';
import { TossPaymentsCancelInput } from './dto/toss.payments.cancel.input';
import { TossPaymentsConfirmInput } from './dto/toss.payments.confirm.input';

@Injectable()
export class TossPaymentsProvider {
  constructor(
    @Inject(DG_LOGGER)
    private readonly logger: DGLogger,
  ) {}
  async approvePayments(input: TossPaymentsConfirmInput) {
    try {
      const { orderId, paymentKey, amount } = input;
      // 결제 승인 로직
      const result = await axios.post(
        envVariables.TOSS_PAYMENTS_CONFIRM_URL,
        {
          orderId,
          paymentKey,
          amount,
        },
        {
          headers: {
            Authorization: 'Basic ' + envVariables.TOSS_PAYMENTS_SECRET_KEY,
          },
        },
      );
      this.logger.log(result);
      return result.data;
    } catch (error) {
      this.logger.log(error);
    }
  }

  async cancelPayments(input: TossPaymentsCancelInput) {
    const { paymentKey, cancelReason } = input;
    // 결제 취소 로직
    const result = await axios.post(
      `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
      {
        cancelReason,
      },
      {
        headers: {
          Authorization: 'Basic ' + envVariables.TOSS_PAYMENTS_SECRET_KEY,
        },
      },
    );
    return result.data;
  }
}
