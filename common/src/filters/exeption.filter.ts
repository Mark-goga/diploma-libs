import { Catch, ExceptionFilter as NestExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { CONFIG } from '@common/constants';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  private readonly logger = new PinoLogger({
    renameContext: 'GrpcExceptionFilter',
  });

  catch(exception: any): Observable<any> {
    const isDevelopment = CONFIG.NODE_ENV === 'development';

    let errorResponse: {
      code: number;
      message: string;
      details: string;
    };

    if (isDevelopment) {
      this.logger.error(exception, 'General error');
    }

    if (exception instanceof RpcException) {
      const error = exception.getError();
      errorResponse = this.getErrorResponse(error);
    } else if (exception && typeof exception === 'object') {
      errorResponse = this.getErrorResponse(exception);
    }

    return throwError(() => errorResponse);
  }

  private getErrorResponse(exception: any) {
    const errorResponse = {
      code: status.INTERNAL,
      message: 'Internal server error',
      details: 'An unexpected error occurred',
    };

    if (exception && typeof exception === 'object') {
      if ('code' in exception && typeof exception.code === 'number') {
        errorResponse.code = exception.code;
      }
      if ('message' in exception && typeof exception.message === 'string') {
        errorResponse.message = exception.message;
      }
      if ('details' in exception && typeof exception.details === 'string') {
        errorResponse.details = exception.details;
      }
    }

    return errorResponse;
  }
}
