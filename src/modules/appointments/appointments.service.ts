import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';

import { AppointmentProvider } from '../database/providers/appointment.provider';
@Injectable()
export class AppointmentsService {
  constructor(private readonly appointmentProvider: AppointmentProvider) {}
  private readonly logger = new Logger(AppointmentsService.name);

  //Cron to remove expired appointments every week
  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    this.logger.log('Clearing all expired tasks');
    await this.appointmentProvider.bulkDeleteAppointments({
      where: {
        appointmentEndDate: {
          [Op.lt]: new Date(),
        },
      },
    });
  }
}
