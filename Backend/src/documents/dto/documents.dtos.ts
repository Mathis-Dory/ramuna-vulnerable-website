import { IsNotEmpty } from 'class-validator';

export class DocumentDto {
  @IsNotEmpty()
  rawData: string;

  @IsNotEmpty()
  documentType: string;

  @IsNotEmpty()
  requestId: number;
}
