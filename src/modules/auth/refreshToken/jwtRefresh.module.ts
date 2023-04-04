import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshService } from './jwtRefresh.service';

@Module({
  imports: [JwtModule],
  providers: [JwtRefreshService],
  exports: [JwtRefreshService],
})
export class JwtRefreshModule {}
