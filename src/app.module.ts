import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DataBaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { loadEnv } from './config';
import { AuthController } from './modules/auth/controllers/auth.controller';
import { AppointmentsController } from './modules/appointments/controllers/appointments.controller';
import { AuthMiddleware } from './modules/auth/middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [loadEnv],
    }),
    AuthModule,
    AppointmentsModule,
    ScheduleModule.forRoot(),
    DataBaseModule,
  ],
  controllers: [AuthController, AppointmentsController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AppointmentsController);
  }
}
