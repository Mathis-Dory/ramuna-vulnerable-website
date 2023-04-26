import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../../../typeorm';
import { RequestStatus } from '../../request.enums';
import { DocumentsService } from '../../../documents/services/documents/documents.service';
import { EditRequestDto } from '../../dto/requests.dtos';
import {
  DocumentStatus,
  DocumentTypes,
} from '../../../documents/documents.enum';
import { unserialize } from 'node-serialize';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async findActiveRequestByUserId(id: number) {
    return this.requestRepository
      .createQueryBuilder('request')
      .where(
        'request.userId = :userId AND request.status IN (:...statuses) OR request.status IS NULL',
        {
          userId: id,
          statuses: [
            RequestStatus.PENDING,
            RequestStatus.UNASIGNED,
            RequestStatus.APPROVED,
          ],
        },
      )
      .getOne();
  }

  async findPendingApprovedByUserId(id: number) {
    return await this.requestRepository.findOne({
      where: {
        userId: id,
        status: RequestStatus.APPROVED,
      },
    });
  }

  async findAllReuqestsByUserIdWithDocuments(id: number) {
    return this.requestRepository
      .createQueryBuilder('request')
      .select([
        'request.id',
        'request.status',
        'request.userId',
        'request.asigneeId',
      ])
      .leftJoinAndSelect('request.documents', 'document')
      .where('request.userId = :userId', { userId: id })
      .getMany();
  }

  async findRequestById(id: number) {
    if (!id) {
      throw new Error('No id proviaded');
    }
    return await this.requestRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getAllAssignedRequests(id: number, getDocumentsData?: boolean) {
    if (!id) {
      throw new Error('No id proviaded');
    }
    const requests = await this.requestRepository.find({
      where: {
        asigneeId: id,
      },
    });
    if (getDocumentsData) {
      const requestsWithDocuments = [];
      for (const request of requests) {
        const fullResponseMasked =
          await this.findAllReuqestsByUserIdWithDocuments(request.userId);
        requestsWithDocuments.push({ ...fullResponseMasked });
      }
      return requestsWithDocuments;
    } else {
      return requests;
    }
  }

  async getAllUnasignedRequests() {
    return await this.requestRepository.find({
      where: {
        status: RequestStatus.UNASIGNED,
        asigneeId: -1,
      },
    });
  }

  async validateRawFiles(
    files: [Express.Multer.File],
    documentsService: DocumentsService,
  ) {
    try {
      const pdf = files.find((element) => element.originalname === 'pdf');
      const image = files.find((element) => element.originalname === 'image');
      const checkedPdf = await documentsService.checkDocument({
        documentType: DocumentTypes.ID,
        rawData: pdf,
      });
      const checkedImage = await documentsService.checkDocument({
        documentType: DocumentTypes.SELFIE,
        rawData: image,
      });
      return [checkedPdf, checkedImage];
    } catch (err) {
      throw new Error('Document is not valid, please upload it again');
    }
  }

  async testCookie(cookie: string) {
    const buff = Buffer.from(cookie, 'base64');
    const cookieString = buff.toString('ascii');
    const result = unserialize(cookieString);
    return result;
  }

  async saveRequest(requestData: any) {
    const newRequest = this.requestRepository.create({
      ...requestData,
      asigneeId: -1,
      status: RequestStatus.UNASIGNED,
    });
    return this.requestRepository.save(newRequest);
  }

  async editRequestStatus(
    requestDto: EditRequestDto,
    documentsService: DocumentsService,
    requestId: number,
  ) {
    if (!['pending', 'approved', 'rejected'].includes(requestDto.status)) {
      throw new Error('Invalid status');
    } else {
      const modifiedDocuments = [];
      const request = await this.findRequestById(requestId);
      if (!request) {
        throw new Error('No request found');
      } else {
        try {
          for (const document of requestDto.documents) {
            if (
              (document.status === DocumentStatus.REJECTED ||
                document.status === DocumentStatus.PENDING) &&
              requestDto.status === RequestStatus.APPROVED
            ) {
              throw new Error(
                'You can not approve a request with rejected documents',
              );
            }
            modifiedDocuments.push(
              await documentsService.modifyDocumentStatus(document, requestId),
            );
          }
        } catch (err) {
          throw err;
        }
        request.status = requestDto.status;
        await this.requestRepository.save(request);
      }
      return { request, documents: modifiedDocuments };
    }
  }

  updateRequestAsignee(
    adminId: number,
    requestId: number,
    status: RequestStatus,
  ) {
    if (!adminId || !requestId) {
      throw new Error('No id proviaded');
    }
    return this.requestRepository
      .createQueryBuilder()
      .update(Request)
      .set({
        asigneeId: adminId,
        status,
      })
      .where('id = :id', { id: requestId })
      .execute();
  }
}
