import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserProvider } from '../database/providers/user.provider';
import { JwtRefreshService } from './refreshToken/jwtRefresh.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly userProvider: UserProvider,
  ) {}

  async createAccessToken(userEmail: string): Promise<string> {
    return this.jwtService.signAsync({ userEmail });
  }

  async createRefreshToken(userEmail: string): Promise<string> {
    return this.jwtRefreshService.signAsync({ userEmail });
  }

  async assignTokens(userEmail: string) {
    return {
      accessToken: await this.createAccessToken(userEmail),
      refreshToken: await this.createRefreshToken(userEmail),
    };
  }

  async verifyAccessToken(accessToken) {
    return this.jwtService.verify(accessToken);
  }

  /** If refresh token is not expired, re-assign new access token and refresh token */
  async refreshAccessToken(refreshToken: string) {
    let decodedRefreshToken;
    try {
      decodedRefreshToken = this.jwtRefreshService.verify(refreshToken);
    } catch (e) {
      throw new ForbiddenException('Use correct token');
    }
    const user = await this.userProvider.findUser(
      decodedRefreshToken.userEmail,
    );

    if (!user) {
      throw new NotFoundException('Please register first');
    }
    const accessToken = await this.createAccessToken(
      decodedRefreshToken.userEmail,
    );
    return { accessToken };
  }
}
