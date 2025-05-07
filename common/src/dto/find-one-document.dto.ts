import { FindOneDocumentDto } from '@proto/common/common';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneDocumentValidator implements FindOneDocumentDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
