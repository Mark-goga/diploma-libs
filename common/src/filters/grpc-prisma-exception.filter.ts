import { Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';

import { status } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';
import { CONFIG } from '@common/constants';
import { GENERAL_ERROR_MESSAGES } from '@lib/src';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class GrpcPrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new PinoLogger({
    renameContext: 'GrpcPrismaExceptionFilter',
  });

  catch(exception: Prisma.PrismaClientKnownRequestError): Observable<any> {
    const isDevelopment = CONFIG.NODE_ENV === 'development';
    if (isDevelopment) {
      this.logger.error(exception, 'Prisma error');
    }

    let error: any;

    if (exception.code === 'P2002') {
      const fieldName = (exception.meta?.target as string[])[0] || 'field';
      const details = `A record with the value ${fieldName} already exists`;

      error = {
        code: status.ALREADY_EXISTS,
        message: GENERAL_ERROR_MESSAGES.CONFLICT,
        details,
      };
    } else if (exception.code === 'P2025') {
      let field = '';
      let value = '';

      if (exception.meta?.arguments) {
        const args = exception.meta.arguments;
        const fieldEntries = Object.entries(args);
        if (fieldEntries.length > 0) {
          const [firstField, firstValue] = fieldEntries[0];
          field = firstField;
          value = String(firstValue);
        }
      }

      const details = `No record found with value ${value} in field ${field} for model ${exception.meta?.modelName}`;

      error = {
        code: status.NOT_FOUND,
        message: GENERAL_ERROR_MESSAGES.NOT_FOUND,
        details,
      };
    } else {
      error = {
        code: status.INTERNAL,
        message: GENERAL_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        details: isDevelopment
          ? exception.message
          : GENERAL_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      };
    }

    return throwError(() => error);
  }
}
