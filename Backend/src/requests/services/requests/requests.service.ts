import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../../../typeorm';
import { RequestStatus } from 'src/requests/request.enums';
import { DocumentDto } from 'src/documents/dto/documents.dtos';
import { DocumentsService } from 'src/documents/services/documents/documents.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async findPendingRequestByUserId(id: number) {
    const request = await this.requestRepository.findOne({
      where: { userId: id, status: RequestStatus.PENDING },
    });
    return request;
  }

  async findPendingApprovedByUserId(id: number) {
    const request = await this.requestRepository.findOne({
      where: {
        userId: id,
        status: RequestStatus.APPROVED,
      },
    });
    return request;
  }

  async validateRawFiles(
    files: DocumentDto[],
    documentsService: DocumentsService,
  ) {
    const checkedDocuments = [];
    for (const document of files) {
      try {
        const checkedDocument = await documentsService.checkDocument(document);
        checkedDocuments.push(checkedDocument);
      } catch (err) {
        throw err;
      }
    }
    if (checkedDocuments.length === files.length) {
      return checkedDocuments;
    } else {
      throw new Error(
        'Some documents are not valid, pleaase upload them again',
      );
    }
  }

  async saveRequest(requestData: any) {
    const newRequest = this.requestRepository.create({ ...requestData });
    return this.requestRepository.save(newRequest);
  }
}
