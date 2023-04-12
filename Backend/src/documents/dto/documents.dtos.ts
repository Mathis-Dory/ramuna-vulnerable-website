import { IsNotEmpty } from 'class-validator';

export class DocumentDto {
  @IsNotEmpty()
  rawData: string;

  status?: string;

  @IsNotEmpty()
  documentType: string;
}
