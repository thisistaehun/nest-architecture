import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-core';
import { Request } from 'express';
import { CustomException } from 'src/modules/common/exception/custom.exception';
import { DG_LOGGER } from 'src/symbols';
import { DGLogger } from '../logger/logger';

@Catch()
@Injectable()
export class GraphQLExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    @Inject(DG_LOGGER)
    private readonly logger: DGLogger,
  ) {
    super();
  }

  async catch(error: Error, host: ArgumentsHost) {
    const ctxType = host.getType() as string;
    if (ctxType === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const context = gqlHost.getContext();
      const req: Request = context.req;
      const operationType = req.body.query.split(' ')[0].toUpperCase();
      const operationName = req.body.operationName;
      const ip = this.getClientIp(req);

      if (error instanceof CustomException) {
        this.logger.error(
          `${ip} ${operationType} ${operationName} ${error.message}`,
          error.stack,
        );

        const extensions = {
          statusCode: error.getStatus(),
        };

        throw new ApolloError(error.message, error.errorCode, extensions);
      } else {
        this.logger.error(
          `${ip} ${operationType} ${operationName} ${error.message}`,
          error.stack,
        );
        throw new ApolloError('Internal Server Error', 'INTERNAL_SERVER_ERROR');
      }
    }
  }

  private getClientIp(req: Request): string | unknown {
    const ip = req.headers['x-forwarded-for'] || req.headers['host'];
    if (!ip) {
      return 'unknown';
    }
    return ip as string;
  }
}
