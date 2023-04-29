import { IsNotEmpty } from 'class-validator';

export class DocumentDto {
  @IsNotEmpty()
  rawData: Buffer;

  status?: string;

  @IsNotEmpty()
  requestId: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  documentType: string;
}
