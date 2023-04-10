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

  @IsNotEmpty()
  userId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  documents: DocumentDto[];
}
