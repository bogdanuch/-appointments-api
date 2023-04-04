import { Request, Response } from 'express';
import {
  NestMiddleware,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { UserProvider } from '../../database/providers/user.provider';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userProvider: UserProvider,
  ) {}

  async use(req: Request | any, res: Response, next: () => void) {
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    if (!bearerHeader || !accessToken) {
      throw new UnauthorizedException('Please register or sign in.');
    }
    let user;
    try {
      const decodedToken = await this.authService.verifyAccessToken(
        accessToken,
      );
      user = await this.userProvider.findUser(decodedToken.userEmail);
    } catch (error) {
      throw new ForbiddenException('Please register or sign in.');
    }
    if (!user) throw new NotFoundException('Not able to find such user');
    req.user = user;
    next();
  }
}
