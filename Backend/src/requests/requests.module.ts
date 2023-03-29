import { Module } from '@nestjs/common';
import { RequestsController } from './controllers/requests/requests.controller';
import { RequestsService } from './services/requests/requests.service';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule {}
