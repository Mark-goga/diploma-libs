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
    const errorResponse = {
      code: status.INTERNAL,
      message: 'Internal server error',
      details: 'An unexpected error occurred',
    };

    const isDevelopment = CONFIG.NODE_ENV === 'development';
    if (isDevelopment) {
      this.logger.error(exception, 'General error');
    }

    if (exception instanceof RpcException) {
      const error = exception.getError();

      if (error && typeof error === 'object') {
        if ('code' in error && typeof error.code === 'number') {
          errorResponse.code = error.code;
        }
        if ('message' in error && typeof error.message === 'string') {
          errorResponse.message = error.message;
        }
        if ('details' in error && typeof error.details === 'string') {
          errorResponse.details = error.details;
        }
      }
    } else if (exception && typeof exception === 'object') {
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

    return throwError(() => errorResponse);
  }
}
