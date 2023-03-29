import { Module } from '@nestjs/common';
import { DocumentsController } from './controllers/documents/documents.controller';
import { DocumentsService } from './services/documents/documents.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentsModule {}
