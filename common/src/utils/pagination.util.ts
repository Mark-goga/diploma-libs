import { PaginationDto, PaginationMeta } from '@proto/common/common';
import { SkipAndLimit } from '@lib/src';

export class PaginationUtil {
  static getSkipAndLimit({ page, limit }: PaginationDto): SkipAndLimit {
    const skip = (page - 1) * limit;
    return { skip, limit };
  }

  static getMeta(page: number, limit: number, total: number): PaginationMeta {
    const countPages = Math.ceil(total / limit);
    return {
      totalItems: total,
      page,
      limit,
      totalPages: countPages,
      hasNext: page < countPages,
      hasPrev: page > 1,
    };
  }
}
