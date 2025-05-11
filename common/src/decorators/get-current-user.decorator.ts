import { createParamDecorator } from '@nestjs/common';

export const getCurrentUser = createParamDecorator(
  (_: unknown, context: any) => {
    return context.switchToRpc().getData().user;
  },
);
