import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Appointment } from './models/appointment.model';
import { User } from './models/user.model';
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule, SequelizeModule.forFeature([Appointment, User])],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('db'),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class DataBaseModule {}
