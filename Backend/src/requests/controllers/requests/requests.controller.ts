import {
  Body,
  Controller,
  HttpStatus,
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
import { SubmitRequestDto } from '../../../requests/dto/requests.dtos';
import { DocumentsService } from 'src/documents/services/documents/documents.service';

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
      req['authorization'],
    );
    const existingRequest =
      await this.requestsService.findPendingRequestByUserId(userId);
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
        await this.documentsService.saveDocuments(
          checkedData,
          savedRequest[0].id,
        );
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
}
