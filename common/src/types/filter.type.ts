import { CustomObject } from '@lib/src';

export type FilterFieldConfig<T> = {
  transform: (value: T) => CustomObject;
};

export type FilterConfig = {
  [key in string]: FilterFieldConfig<any>;
};
