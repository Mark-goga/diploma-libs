import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName, ROLES_KEY } from '../decorators';
import { GENERAL_ERROR_MESSAGES } from '@lib/src';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const contextType = context.getType();
    let user;

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest();
      user = request.user;
    } else {
      const rpcContext = context.switchToRpc();
      const data = rpcContext.getData();

      user = data.user;
    }

    const isUserHasRole = requiredRoles.some((role) => {
      return user?.role === role;
    });

    if (!isUserHasRole) {
      if (contextType === 'http') {
        throw new ForbiddenException(
          GENERAL_ERROR_MESSAGES.YUO_DONT_HAVE_PERMISSION_TO_ACCESS_THIS_RESOURCE,
        );
      } else {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          details:
            GENERAL_ERROR_MESSAGES.YUO_DONT_HAVE_PERMISSION_TO_ACCESS_THIS_RESOURCE,
        });
      }
    }

    return true;
  }
}
