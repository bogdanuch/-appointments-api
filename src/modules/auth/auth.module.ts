import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DataBaseModule } from '../database/database.module';
import { JwtRefreshModule } from './refreshToken/jwtRefresh.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtRefreshModule,
    DataBaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
