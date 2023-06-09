import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

/** Service to implement second jwt secret */
@Injectable()
export class JwtRefreshService extends JwtService {
  constructor() {
    super({
      secret: process.env.JWT_REFRESH_SECRET,
      signOptions: { expiresIn: '7d' },
    });
  }
}
