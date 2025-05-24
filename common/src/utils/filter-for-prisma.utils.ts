import { FilterDto } from '@proto/common/common';
import { FilterConfig, GENERAL_ERROR_MESSAGES } from '@lib/src';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class FilterUtil {
  static buildPrismaWhere<T extends object>(
    filters?: Array<FilterDto>,
    config?: FilterConfig,
  ) {
    if (!filters || filters.length === 0) {
      return {};
    }

    return filters.reduce((acc, filter) => {
      if (config && config[filter.field] && config[filter.field].transform) {
        acc[filter.field] = config[filter.field].transform(filter.value);
      } else {
        acc[filter.field] = {
          contains: filter.value,
          mode: 'insensitive',
        };
      }
      return acc;
    }, {} as T);
  }

  static getConfigForArray(value: string) {
    if (value.includes(',')) {
      const genres = value.split(',').map((g) => g.trim());
      return {
        hasSome: genres,
      };
    }
    return {
      has: value,
    };
  }

  static getConfigForNumber(value: string, operator: string = 'equals') {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        details: GENERAL_ERROR_MESSAGES.INVALID_NUMBER_VALUE,
        message: GENERAL_ERROR_MESSAGES.VALIDATION_ERROR,
      });
    }
    return {
      [operator]: parsedValue,
    };
  }
}
