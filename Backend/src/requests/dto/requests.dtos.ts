import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { DocumentDto } from '../../documents/dto/documents.dtos';

export class SubmitRequestDto {
  @IsNotEmpty()
  data: any = {};

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  documents: DocumentDto[];
}

export class EditRequestDto {
  @IsNotEmpty()
  data: any = {};

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  asigneeId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  documents: DocumentDto[];
}
