import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExtractJwt } from 'passport-jwt';
import { UserRole } from 'src/modules/api/user/type/user.role';
import { UnauthorizedCustomException } from 'src/modules/common/exception/unauthorized-exception';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { JwtAuthService } from '../service/jwt.auth.service';
import { AccessTokenPayload } from '../type/access-token.payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: UserRole[] = this.reflector.getAllAndOverride<
      UserRole[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      requiredRoles.push(UserRole.FREE_USER);
    }

    const gqlContextReq = GqlExecutionContext.create(context).getContext().req;
    const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(gqlContextReq);

    if (!bearer) throw new UnauthorizedException();

    const decoded: AccessTokenPayload =
      this.jwtAuthService.verifyAccessToken(bearer);

    const passed: boolean = requiredRoles.some((role: UserRole) =>
      this.compareRoleLevel(role, decoded.role),
    );

    if (!passed) {
      throw new UnauthorizedCustomException('권한없는 사용자입니다. ');
    }

    return true;
  }

  private convertRoleLevel(role: UserRole): number {
    switch (role) {
      case UserRole.ADMIN:
        return 4;
      case UserRole.MANAGER:
        return 3;
      case UserRole.PAID_USER:
        return 2;
      case UserRole.FREE_USER:
        return 1;
      case UserRole.UNAUTH_USER:
        return -1;
      default:
        return 1;
    }
  }

  private compareRoleLevel(
    requiredRole: UserRole,
    userRole: UserRole,
  ): boolean {
    const isHigherRole: boolean =
      this.convertRoleLevel(requiredRole) <= this.convertRoleLevel(userRole);
    return isHigherRole;
  }
}
