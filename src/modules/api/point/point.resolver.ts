import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/infrastructure/auth/decorator/current.user.decorator';
import { Roles } from 'src/modules/infrastructure/auth/decorator/roles.decorator';
import { UserAuth } from '../user/type/user.auth.type';
import { UserRole } from '../user/type/user.role';
import { ChargePointInput } from './dto/charge/input/charge.point.input';
import { UserWallet } from './entities/total-point.entity';
import { PointService } from './point.service';
import { ChargePointUsecase } from './usecase/charge/charge-point.usecase';
import { UsePointUsecase } from './usecase/use/use-point.usecase';

@Resolver()
export class PointResolver {
  constructor(
    private readonly chargePointUsecase: ChargePointUsecase,
    private readonly usePointUsease: UsePointUsecase,
    private readonly pointService: PointService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Mutation(() => UserWallet, {
    description: '포인트 충전',
  })
  public async ADMIN_chargePoint(
    @Args('input') input: ChargePointInput,
    @Args('userCode') userCode: string,
  ): Promise<UserWallet> {
    return await this.chargePointUsecase.execute(input, userCode);
  }

  @Roles(UserRole.FREE_USER)
  @Mutation(() => UserWallet, {
    description: '포인트 사용',
  })
  public async usePoint(
    @Args('input') input: ChargePointInput,
    @CurrentUser() userAuth: UserAuth,
  ): Promise<UserWallet> {
    return await this.usePointUsease.execute(input, userAuth);
  }

  @Roles(UserRole.FREE_USER)
  @Query(() => UserWallet, {
    description: '총 포인트 조회',
  })
  public async getTotalPoint(
    @CurrentUser() userAuth: UserAuth,
  ): Promise<UserWallet> {
    return await this.pointService.getTotalPoint(userAuth.code);
  }
}
