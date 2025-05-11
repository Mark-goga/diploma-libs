import { ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GENERAL_ERROR_MESSAGES } from '@lib/src';

export class GetTokensUtil {
  static getTokenFromMetadata(context: ExecutionContext): string {
    const metadata = context.switchToRpc().getContext();
    const authorization = metadata.get('authorization')?.[0];

    if (!authorization) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        details: GENERAL_ERROR_MESSAGES.AUTHORIZATION_NOT_FOUND,
      });
    }

    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        details: GENERAL_ERROR_MESSAGES.BEARER_OR_TOKEN_NOT_FOUND,
      });
    }

    return token;
  }

  static getRefreshTokenFromMetadata(context: ExecutionContext): string {
    const metadata = context.switchToRpc().getContext();
    const refreshToken = metadata.get('refresh-token')?.[0];

    if (!refreshToken) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        details: GENERAL_ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND,
      });
    }

    return refreshToken;
  }
}
