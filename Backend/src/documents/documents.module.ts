import { Module } from '@nestjs/common';
import { DocumentsController } from './controllers/documents/documents.controller';
import { DocumentsService } from './services/documents/documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
