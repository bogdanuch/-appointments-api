import { BadRequestException, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { IAppointment, Appointment } from '../models/appointment.model';
import { dateTransformer } from '../../../common/utils';

@Injectable()
export class AppointmentProvider {
  public async createAppointment(appointmentData: IAppointment) {
    return Appointment.create(appointmentData);
  }
  public async findAppointments(searchParams) {
    return Appointment.findAll(searchParams);
  }

  public async getStats(email: string, minimumDate: Date, maximumDate: Date) {
    if (new Date(minimumDate) > new Date(maximumDate))
      throw new BadRequestException('Maximum is bigger then minimum');

    const appointments = await this.findAppointments({
      where: {
        email,
        [Op.and]: [
          {
            appointmentStartDate: {
              [Op.lte]: maximumDate,
            },
          },
          {
            appointmentEndDate: {
              [Op.gte]: minimumDate,
            },
          },
        ],
      },
    });
    const stats: { [key: string]: number } = {};
    appointments.forEach((appointment) => {
      const appointmentStartDay = dateTransformer(
        appointment.appointmentStartDate,
      );
      const appointmentEndDay = dateTransformer(appointment.appointmentEndDate);
      const appointmentStartObject = new Date(appointmentStartDay);
      const appointmentEndObject = new Date(appointmentEndDay);
      while (
        appointmentStartObject <= appointmentEndObject &&
        appointmentStartObject <= maximumDate
      ) {
        if (appointmentStartObject >= minimumDate) {
          const iterationStartString = dateTransformer(appointmentStartObject);
          if (!stats[iterationStartString]) {
            stats[iterationStartString] = 1;
          } else {
            stats[iterationStartString]++;
          }
        }
        appointmentStartObject.setDate(appointmentStartObject.getDate() + 1);
      }
    });
    return stats;
  }

  public async deleteAppointment(appointmentId: number, userEmail: string) {
    let destroyedAmount: number;
    try {
      await this.isUsersAppointment(appointmentId, userEmail);
      destroyedAmount = await Appointment.destroy({
        where: { id: appointmentId },
      });
    } catch (e) {
      throw new BadRequestException(
        'Unable to destroy appointment with such id',
      );
    }

    return !!destroyedAmount;
  }
  public async updateAppointment(appointmentData: IAppointment) {
    await this.isUsersAppointment(appointmentData.id, appointmentData.email);
    return Appointment.update(appointmentData, {
      where: { id: appointmentData.id },
    });
  }
  public async findAppointment(id: number) {
    return Appointment.findOne({ where: { id } });
  }
  public async isUsersAppointment(appointmentId: number, userEmail: string) {
    const appointment: IAppointment = await this.findAppointment(appointmentId);
    if (appointment.email !== userEmail)
      throw new BadRequestException("Can't find such appointment");
  }
  public async bulkDeleteAppointments(params) {
    return Appointment.destroy(params);
  }
}
