import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RequestsService } from '../../../requests/services/requests/requests.service';
import { UsersService } from '../../../users/services/users/users.service';
import { Roles } from '../../../common/role.decorator';
import { Role } from '../../../common/role.enum';
import {
  EditRequestDto,
  SubmitRequestDto,
} from '../../../requests/dto/requests.dtos';
import { DocumentsService } from '../../../documents/services/documents/documents.service';
import { RequestStatus } from '../../../requests/request.enums';

@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly userService: UsersService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Roles(Role.User)
  @Post('/postRequest')
  @UsePipes(ValidationPipe)
  async postNews(
    @Req() req,
    @Res() response,
    @Body() submitRequestDto: SubmitRequestDto,
  ) {
    const userId = await this.userService.getUserIdFromJwt(
      req['headers']['authorization'],
    );
    const existingRequest =
      await this.requestsService.findActiveRequestByUserId(userId);
    if (!existingRequest) {
      let checkedData = [];
      try {
        checkedData = await this.requestsService.validateRawFiles(
          submitRequestDto.documents,
          this.documentsService,
        );
        const savedRequest = await this.requestsService.saveRequest({
          data: submitRequestDto.data,
          userId,
        });
        await this.documentsService.saveDocuments(checkedData, savedRequest);
        return response.status(HttpStatus.CREATED).json({
          status: 'OK',
          userId,
          documents: checkedData,
          additionalInfo: submitRequestDto.data,
        });
      } catch (err) {
        throw err;
      }
    } else {
      const approvedRequest =
        await this.requestsService.findPendingApprovedByUserId(userId);
      if (approvedRequest) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'You have already beed approved. No application needed',
        });
      }
      return response.status(HttpStatus.CONFLICT).json({
        message:
          'Request already exists for this user. Please wait for the process to finish,',
      });
    }
  }

  @Roles(Role.User)
  @Get('requestsHistory')
  async findRequestsByUserId(@Req() req, @Res() response) {
    const userId = await this.userService.getUserIdFromJwt(
      req['headers']['authorization'],
    );
    if (!userId) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'We are having trouble with the site, please log in again.',
      });
    }
    const requests =
      await this.requestsService.findAllReuqestsByUserIdWithDocuments(userId);
    return response.status(HttpStatus.OK).json(requests);
  }

  @Roles(Role.Admin)
  @Get('admin/assigned')
  async getAllAssignedRequests(@Req() req, @Res() response) {
    const userId = await this.userService.getUserIdFromJwt(
      req['headers']['authorization'],
    );
    if (!userId) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'We are having trouble with the site, please log in again.',
      });
    }
    return response
      .status(HttpStatus.OK)
      .json(await this.requestsService.getAllAssignedRequests(userId, true));
  }

  @Roles(Role.Admin)
  @Post('/editRequestStatus/id/:id')
  @UsePipes(ValidationPipe)
  async editNews(
    @Res() response,
    @Req() req,
    @Param('id') id,
    @Body() editRequestDto: EditRequestDto,
  ) {
    const existingRequest = await this.requestsService.findRequestById(id);
    if (!existingRequest) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'No such requests found in the database.',
      });
    } else {
      if (existingRequest.status === RequestStatus.APPROVED) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'This request is already approved',
        });
      }
      const userId = await this.userService.getUserIdFromJwt(
        req['headers']['authorization'],
      );
      if (userId != existingRequest.asigneeId) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'You are not allowed to edit this request.',
        });
      }
      const newRequest = await this.requestsService.editRequestStatus(
        editRequestDto,
        this.documentsService,
        id,
      );
      return response.status(HttpStatus.OK).json(newRequest);
    }
  }
}
