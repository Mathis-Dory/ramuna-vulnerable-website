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
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  pdf: Express.Multer.File;
  @IsNotEmpty()
  image: Express.Multer.File;
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
