import {
  Body,
  Controller,
  Req,
  Get,
  Delete,
  Put,
  Post,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';

import { AppointmentProvider } from '../../database/providers/appointment.provider';
import { appointmentDto } from './appointment.dto';
import { IAppointment } from '../../database/models/appointment.model';
import { QueryPaginationParams, getStatsResp } from '../interfaces';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentProvider: AppointmentProvider) {}
  @Get()
  @HttpCode(200)
  async findAll(
    @Req() req,
    @Query() { page = 1, size = 10 }: QueryPaginationParams,
  ) {
    return this.appointmentProvider.findAppointments({
      where: { email: req.user.email },
      offset: (page - 1) * size,
      limit: size,
    });
  }
  @Get('stats')
  @HttpCode(200)
  async findStats(
    @Req() req,
    @Query()
    { minimumDate = new Date(), maximumDate }: getStatsResp,
  ) {
    return this.appointmentProvider.getStats(
      req.user.email,
      new Date(minimumDate),
      new Date(maximumDate),
    );
  }
  @Post()
  @HttpCode(201)
  async createAppointment(
    @Req() req,
    @Body() body: appointmentDto,
  ): Promise<IAppointment> {
    return this.appointmentProvider.createAppointment({
      ...body,
      email: req.user.email.toString(),
    });
  }
  @Put(':id')
  @HttpCode(201)
  async updateAppointment(
    @Req() req,
    @Param('id') id: number,
    @Body() body: appointmentDto,
  ): Promise<[number, IAppointment[]]> {
    return this.appointmentProvider.updateAppointment({
      ...body,
      id,
      email: req.user.email.toString(),
    });
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteAppointment(
    @Req() req,
    @Param('id') id: number,
  ): Promise<boolean> {
    return this.appointmentProvider.deleteAppointment(id, req.user.email);
  }
}
