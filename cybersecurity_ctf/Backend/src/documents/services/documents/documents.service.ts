import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DocumentTypes,
  DocumentType,
  DocumentStatus,
} from '../../documents.enum';
import { Document } from '../../../typeorm';
import { fileTypeFromBuffer } from '../../file-type-importer';
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

  async isPdf(file: Express.Multer.File): Promise<boolean> {
    try {
      // Check the first 261 bytes, as file-type requires at least this many bytes for detection
      const requiredBytesForDetection = 261;
      const buffer = file.buffer.slice(0, requiredBytesForDetection);
      const fileTypeResult = await fileTypeFromBuffer(buffer);

      if (fileTypeResult && fileTypeResult.ext === 'pdf') {
        return true;
      }
    } catch (error) {
      console.error('Error detecting file type:', error);
    }

    return false;
  }

  async isPng(file: Express.Multer.File): Promise<boolean> {
    try {
      // Check the first 261 bytes, as file-type requires at least this many bytes for detection
      const requiredBytesForDetection = 261;
      const buffer = file.buffer.slice(0, requiredBytesForDetection);
      const fileTypeResult = await fileTypeFromBuffer(buffer);

      if (fileTypeResult && fileTypeResult.ext === 'png') {
        return true;
      }
    } catch (error) {
      console.error('Error detecting file type:', error);
    }

    return false;
  }

  async checkDocument(document: any) {
    switch (document.documentType) {
      case DocumentTypes.ID:
        if (await this.isPdf(document.rawData)) {
          return { ...document, type: DocumentType.DOCUMENT };
        } else {
          throw new HttpException(
            'Invalid files format uploaded',
            HttpStatus.FORBIDDEN,
          );
        }
      case DocumentTypes.SELFIE:
        if (await this.isPng(document.rawData)) {
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
