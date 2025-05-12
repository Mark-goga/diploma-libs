import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { TOKEN_TYPE_KEY } from '@lib/src/decorators';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  TokenType,
} from '@proto/auth/auth';
import { GetTokensUtil } from '@lib/src';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async canActivate(context: ExecutionContext) {
    const rpcContext = context.switchToRpc();
    const tokenType = this.getTokenTypeFromContext(context);

    const token = this.getToken(context);
    const { user } = await this.authService
      .validateToken({ token, type: tokenType })
      .toPromise();

    rpcContext.getData().user = user;
    return true;
  }

  private getToken(context: ExecutionContext): string {
    const tokenType = this.getTokenTypeFromContext(context);

    return tokenType === TokenType.ACCESS
      ? GetTokensUtil.getTokenFromMetadata(context)
      : GetTokensUtil.getRefreshTokenFromMetadata(context);
  }

  private getTokenTypeFromContext(context: ExecutionContext): TokenType {
    const handler = context.getHandler();
    const requiredTokenType = Reflect.getMetadata(TOKEN_TYPE_KEY, handler);

    return requiredTokenType || TokenType.ACCESS;
  }
}
