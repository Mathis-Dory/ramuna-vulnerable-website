import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../../users/services/users/users.service';
import { RequestsService } from '../../requests/services/requests/requests.service';
import { RequestStatus } from '../../requests/request.enums';

@Injectable()
export class CronJobUtil {
  constructor(
    private usersService: UsersService,
    private requestsService: RequestsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronJob() {
    console.log('Cron job executed every 1 minute:', new Date());
    const allAdmins = await this.usersService.getAdminUsers();
    const allUnasignedRequests =
      await this.requestsService.getAllUnasignedRequests();
    if (allUnasignedRequests.length === 0) {
      console.log(
        'Cron job executed, no new requests to be assigned:',
        new Date(),
      );
    }
    const adminJobs = [];
    for (const admin of allAdmins) {
      const assingedRequests =
        await this.requestsService.getAllAssignedRequests(admin.id);
      adminJobs.push({ ...admin, currentJobs: assingedRequests.length });
    }
    adminJobs.sort((a, b) => a.currentJobs - b.currentJobs);
    for (const request of allUnasignedRequests) {
      const admin = adminJobs.shift();
      await this.requestsService.updateRequestAsignee(
        admin.id,
        request.id,
        RequestStatus.PENDING,
      );
      adminJobs.push({ ...admin, currentJobs: admin.currentJobs + 1 });
    }
  }
}
