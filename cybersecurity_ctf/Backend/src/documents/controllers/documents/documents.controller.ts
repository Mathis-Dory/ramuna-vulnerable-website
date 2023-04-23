import { Controller, Get, Param, Res } from '@nestjs/common';

import { DocumentsService } from 'src/documents/services/documents/documents.service';
import { Response } from 'express';
import { DocumentType } from 'src/documents/documents.enum';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const fileData = await this.documentsService.getDocumentById(
      Number.parseInt(id),
    );

    if (!fileData) {
      res.status(404).send('File not found');
      return;
    }

    res.setHeader(
      'Content-Type',
      fileData.type === DocumentType.DOCUMENT ? 'application/pdf' : 'image/png',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileData.documentType}-${fileData.id}.${
        fileData.type === DocumentType.DOCUMENT ? 'pdf' : 'png'
      }`,
    );
    res.send(fileData.rawData);
  }
}
