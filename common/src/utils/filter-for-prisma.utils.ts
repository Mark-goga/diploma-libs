import { FilterDto } from '@proto/common/common';
import { FilterConfig } from '@lib/src';

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
}
