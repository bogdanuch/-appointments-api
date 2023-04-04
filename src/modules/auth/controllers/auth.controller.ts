import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { UserProvider } from '../../database/providers/user.provider';
import { AuthService } from '../auth.service';
import { refreshToken } from '../decorators/refreshTokenDecorator';
import { CookieInterceptor } from '../interceptors/cookie.interceptor';
import { authDto } from './auth.dto';
import { LoginResponse } from '../interfaces';

@UseInterceptors(CookieInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private userProvider: UserProvider,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(201)
  async createUser(@Body() body: authDto): Promise<LoginResponse> {
    const user = await this.userProvider.createUser(body);
    if (!user) {
      throw new ForbiddenException('Not able to create user with such data');
    }
    const tokens = await this.authService.assignTokens(user.email);
    return tokens;
  }
  @Post('login')
  @HttpCode(201)
  async login(@Body() body: authDto): Promise<LoginResponse> {
    const isDataCorrect = this.userProvider.verifyUser(body);
    if (!isDataCorrect)
      throw new ForbiddenException('Username or password is invalid');
    const tokens = await this.authService.assignTokens(body.email);
    return tokens;
  }
  @Post('refresh-token')
  @HttpCode(201)
  async refreshAccess(@refreshToken() token): Promise<LoginResponse> {
    return this.authService.refreshAccessToken(token);
  }
}
