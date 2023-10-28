import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { UserAuth } from '../user/type/user.auth.type';
import { ChargePointInput } from './dto/charge/input/charge.point.input';
import { TotalPoint } from './entities/total-point.entity';
import { ChargePointUsecase } from './usecase/charge/charge-point.usecase';

@Resolver()
export class PointResolver {
  constructor(private readonly chargePointUsecase: ChargePointUsecase) {}
  @Mutation(() => TotalPoint, {
    description: '포인트 충전',
  })
  public async chargePoint(
    @Args('input') input: ChargePointInput,
    @CurrentUser() userAuth: UserAuth,
  ): Promise<TotalPoint> {
    return await this.chargePointUsecase.execute(input, userAuth);
  }
}
