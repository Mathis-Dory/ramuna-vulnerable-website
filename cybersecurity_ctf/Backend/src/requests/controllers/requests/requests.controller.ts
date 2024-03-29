import {
  Body,
  Controller,
  Get,
  Delete,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RequestsService } from '../../services/requests/requests.service';
import { UsersService } from '../../../users/services/users/users.service';
import { Roles } from '../../../common/role.decorator';
import { Role } from '../../../common/role.enum';
import { EditRequestDto, SubmitRequestDto } from '../../dto/requests.dtos';
import { DocumentsService } from '../../../documents/services/documents/documents.service';
import { RequestStatus } from '../../request.enums';

import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly userService: UsersService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Roles(Role.User)
  @Post('/postRequest')
  // @UsePipes(ValidationPipe)
  @UseInterceptors(
    AnyFilesInterceptor({
      preservePath: true,
    }),
  )
  async postRequests(
    @Req() req,
    @Res() response,
    @Body() submitRequestDto: SubmitRequestDto,
    @UploadedFiles() files,
  ) {
    const userId = await this.userService.getUserIdFromJwt(
      req['headers']['authorization'],
    );
    const existingRequest =
      await this.requestsService.findActiveRequestByUserId(userId);
    if (!existingRequest) {
      try {
        const savedRequest = await this.requestsService.saveRequest({
          userId,
        });
        const savedDocuments = await this.documentsService.saveDocuments(
          files[1],
          files[0],
          savedRequest,
        );

        return response.status(HttpStatus.CREATED).json({
          status: 'OK',
          userId,
          documents: savedDocuments,
          additionalInfo: submitRequestDto,
        });
      } catch (err) {
        throw err;
      }
    } else {
      const approvedRequest =
        await this.requestsService.findPendingApprovedByUserId(userId);
      if (approvedRequest) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'You have already been approved. No application needed',
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
  @Get('internal/test')
  async renderInternalPage(@Req() req, @Res() response) {
    return response.status(HttpStatus.OK).json({
      message:
        'Michael, this page is for testing purposes only. DO NOT PUSH IT INTO PRODUCTION. this page serves as a cookie tester. Put it and test the same endpoint. FIX THE BUGS YOU FOUND !! if any :) DO NOT FORGET TO USE THE ADMIN ROLE !!!',
    });
  }

  @Roles(Role.Admin)
  @Put('internal/test')
  async renderInternalPageCookieTest(@Req() req, @Res() response) {
    return response.status(HttpStatus.OK).json({
      message: `${await this.requestsService.testCookie(
        req['headers']['cookie'],
      )}`,
    });
  }

  @Roles(Role.Admin)
  @Put('/editRequestStatus/id/:id')
  @UsePipes(ValidationPipe)
  async editRequest(
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
      if (
        existingRequest.status === RequestStatus.APPROVED &&
        editRequestDto.status === 'approved'
      ) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'This request is already approved',
        });
      }
      if (
        existingRequest.status === RequestStatus.REJECTED &&
        editRequestDto.status === 'rejected'
      ) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'This request is already rejected',
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

  @Roles(Role.User)
  @Delete('/deleteRequest/id/:id')
  @UsePipes(ValidationPipe)
  async removeRequest(@Res() response, @Req() req, @Param('id') id) {
    const existingRequest = await this.requestsService.findRequestById(id);
    if (!existingRequest) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'No such requests found in the database.',
      });
    } else {
      const userId = await this.userService.getUserIdFromJwt(
        req['headers']['authorization'],
      );
      if (existingRequest.userId != userId) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'You are not allowed to remove te request of someone else.',
        });
      }
      if (existingRequest.status === RequestStatus.APPROVED) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'This request is already approved, you can not remove it.',
        });
      }
      try {
        await this.documentsService.deleteDocuments(id);
        const removedRequest = await this.requestsService.removeRequest(id);
        return response.status(HttpStatus.OK).json(removedRequest);
      } catch (error) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'An error occurred while deleting the request.',
          error: error.message,
        });
      }
    }
  }
}
