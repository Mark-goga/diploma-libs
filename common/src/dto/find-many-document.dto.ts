import { FindManyDto, SortDirection } from '@proto/common/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDtoValidator {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  page: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Max(50)
  limit: number;
}

export function CreateFindManyDtoValidator(
  sortEnumType: object,
  filterEnumType: object,
) {
  class SortingDtoValidator {
    @IsEnum(sortEnumType)
    @IsNotEmpty()
    field: string;

    @IsEnum(SortDirection)
    @IsNotEmpty()
    direction: number;
  }

  class FilterDtoValidator {
    @IsEnum(filterEnumType)
    field: string;

    @IsString()
    value: string;
  }

  class FindManyGenericValidator implements FindManyDto {
    @ValidateNested()
    @Type(() => PaginationDtoValidator)
    @IsNotEmpty()
    pagination: PaginationDtoValidator;

    @ValidateNested()
    @Type(() => SortingDtoValidator)
    sorting: SortingDtoValidator;

    @ValidateNested({ each: true })
    @Type(() => FilterDtoValidator)
    filters: FilterDtoValidator[];
  }

  return FindManyGenericValidator;
}
