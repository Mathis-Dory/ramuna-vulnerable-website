import { Module } from '@nestjs/common';
import { RequestsController } from './controllers/requests/requests.controller';
import { RequestsService } from './services/requests/requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request, User, Document } from '../typeorm';
import { UsersService } from '../users/services/users/users.service';
import { DocumentsService } from '../documents/services/documents/documents.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Document]),
  ],
  controllers: [RequestsController],
  providers: [UsersService, RequestsService, DocumentsService],
})
export class RequestsModule {}
