import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AccessTokenPayload } from '../type/access-token.payload';

export const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator =
  createParamDecorator(
    (_data: unknown, context: ExecutionContext): AccessTokenPayload => {
      const ctx = GqlExecutionContext.create(context).getContext();
      return ctx.req.user;
    },
  );
