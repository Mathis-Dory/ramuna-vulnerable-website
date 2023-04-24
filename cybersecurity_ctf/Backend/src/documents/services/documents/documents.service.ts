import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DocumentTypes,
  DocumentType,
  DocumentStatus,
} from '../../documents.enum';
import { Document } from '../../../typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async saveDocuments(documents: any, request: any) {
    const requestId = request.id;
    for (const document of documents) {
      const newDocument = this.documentRepository.create({
        ...document,
        requestId,
        status: DocumentStatus.PENDING,
      });
      await this.documentRepository.save(newDocument);
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
          throw new HttpException(
            'Invalid files format uploaded',
            HttpStatus.FORBIDDEN,
          );
        }
      case DocumentTypes.SELFIE:
        if (document.rawData.includes('/^data:image/png;base64,/')) {
          return { ...document, type: DocumentType.PICTURE };
        } else {
          throw new HttpException(
            'Invalid files format uploaded',
            HttpStatus.FORBIDDEN,
          );
        }
      default:
        throw new HttpException(
          'Invalid files format uploaded',
          HttpStatus.FORBIDDEN,
        );
    }
  }

  async modifyDocumentStatus(document: any, requestId: number) {
    if (!document.documentType || !requestId)
      throw new HttpException('Invalid document data', HttpStatus.FORBIDDEN);
    const documentToUpdate = await this.documentRepository.findOne({
      where: {
        documentType: document.documentType,
        requestId,
      },
    });
    if (!['pending', 'approved', 'rejected'].includes(document.status)) {
      throw new HttpException('Invalid document status', HttpStatus.FORBIDDEN);
    }
    documentToUpdate.status = document.status;
    return this.documentRepository.save(documentToUpdate);
  }

  async getDocumentById(id: number) {
    return this.documentRepository.findOne({ where: { id } });
  }
}
