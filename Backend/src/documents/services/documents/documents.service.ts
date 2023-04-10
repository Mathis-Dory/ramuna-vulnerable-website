import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DocumentTypes,
  DocumentType,
  DocumentStatus,
} from '../../../documents/documents.enum';
import { Document } from '../../../typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly newsRepository: Repository<Document>,
  ) {}

  async saveDocuments(documents: any, requestId: number) {
    for (const document of documents) {
      const newDocument = this.newsRepository.create({
        ...document,
        requestId,
        status: DocumentStatus.PENDING,
      });
      await this.newsRepository.save(newDocument);
    }
  }

  async checkDocument(document: any) {
    switch (document.documentType) {
      case DocumentTypes.ID:
      case DocumentTypes.LETTER1:
      case DocumentTypes.LETTER2:
        if (
          document.rawData.slice(0, 5).toString() === '%PDF-' &&
          document.rawData.slice(-5).toString() === '%%EOF'
        ) {
          return { ...document, type: DocumentType.DOCUMENT };
        } else {
          break;
        }
      case DocumentTypes.SELFIE:
        if (document.rawData.includes('/^data:image/png;base64,/')) {
          return { ...document, type: DocumentType.PICTURE };
        } else {
          break;
        }
      default:
        throw new HttpException(
          'Invalid files format uploaded',
          HttpStatus.FORBIDDEN,
        );
    }
  }
}
