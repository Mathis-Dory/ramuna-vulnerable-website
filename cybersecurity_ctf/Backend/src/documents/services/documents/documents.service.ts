import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentStatus } from '../../documents.enum';
import { Document } from '../../../typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}


  async saveDocuments(
      image: Express.Multer.File,
      pdf: Express.Multer.File,
      request: any,
  ) {
    const requestId = request.id;
    let pdfExist = false;
    const newDocumentImage = this.documentRepository.create({
      type: image.mimetype,
      documentType: image.originalname,
      rawData: image.buffer,
      requestId,
      status: DocumentStatus.PENDING,
    });
    await this.documentRepository.save(newDocumentImage);

    try {
      fs.readFileSync(pdf.originalname)
      pdfExist = true;
    }
    catch (error) {
      console.log(error);
    }

    const newDocumentPdf = this.documentRepository.create({
      type: pdf.mimetype,
      documentType: pdf.originalname,
      rawData: pdfExist ? fs.readFileSync(pdf.originalname) : pdf.buffer,
      requestId,
      status: DocumentStatus.PENDING,
    });
    await this.documentRepository.save(newDocumentPdf);
    return { pdf: newDocumentPdf, image: newDocumentImage };
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

  async deleteDocuments(requestId: number) {
    const documents = await this.documentRepository.find({
      where: { requestId },
    });
    const deletePromises = documents.map((document) => {
      return this.documentRepository.delete(document);
    });
    await Promise.all(deletePromises);
  }

  async getDocumentById(id: number) {
    return this.documentRepository.findOne({ where: { id } });
  }
}
