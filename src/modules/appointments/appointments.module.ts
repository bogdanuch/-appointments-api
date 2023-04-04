import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { DataBaseModule } from '../database/database.module';

@Module({
  imports: [DataBaseModule],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
