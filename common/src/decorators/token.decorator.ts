import { SetMetadata } from '@nestjs/common';
import { TokenType } from '@proto/auth/auth';

export const TOKEN_TYPE_KEY = 'tokenType';
export const TokenTypeDecorator = (tokenType: TokenType) => {
  return SetMetadata(TOKEN_TYPE_KEY, tokenType);
};
