import { ValidationError, ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GENERAL_ERROR_MESSAGES } from '@lib/src';

export class GrpcValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = this.formatErrors(validationErrors);

        return new RpcException({
          code: status.INVALID_ARGUMENT,
          message: GENERAL_ERROR_MESSAGES.VALIDATION_ERROR,
          details: JSON.stringify(errors),
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints || {}).join(', ');
      if (error.children && error.children.length > 0) {
        acc[error.property] = this.formatErrors(error.children);
      }
      return acc;
    }, {});
  }
}
