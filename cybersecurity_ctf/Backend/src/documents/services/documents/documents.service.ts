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
    const tempDir = '../../../temp/';
    fs.mkdirSync(tempDir, { recursive: true });

    const tempImage = tempDir + image.originalname;
    fs.writeFileSync(tempImage, image.buffer);

    const tempPdf = tempDir + pdf.originalname;
    fs.writeFileSync(tempPdf, pdf.buffer);

    const requestId = request.id;
    const imageContent = fs.readFileSync(tempImage);
    const newDocumentImage = this.documentRepository.create({
      type: image.mimetype,
      documentType: image.originalname,
      rawData: imageContent,
      requestId,
      status: DocumentStatus.PENDING,
    });
    await this.documentRepository.save(newDocumentImage);

    const pdfContent = fs.readFileSync(tempPdf);
    const newDocumentPdf = this.documentRepository.create({
      type: pdf.mimetype,
      documentType: pdf.originalname,
      rawData: pdfContent,
      requestId,
      status: DocumentStatus.PENDING,
    });
    await this.documentRepository.save(newDocumentPdf);
    fs.unlinkSync(tempImage);
    fs.unlinkSync(tempPdf);
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
