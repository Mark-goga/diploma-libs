import { CustomObject } from '@lib/src';
import { SortingDto } from '@proto/common/common';

export class SortForPrismaUtil {
  static sortForPrisma<T extends CustomObject>(sort: SortingDto): T {
    if (!sort && !sort?.field) {
      return {} as T;
    }

    return {
      [sort.field]: sort.direction === 1 ? 'asc' : 'desc',
    } as T;
  }
}
