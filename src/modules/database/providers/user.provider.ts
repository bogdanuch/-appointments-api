import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';

import { IUser, User } from '../models/user.model';
import { authDto } from '../../auth/controllers/auth.dto';

@Injectable()
export class UserProvider {
  constructor(private readonly configService: ConfigService) {}
  public async createUser(userData: authDto): Promise<IUser> {
    try {
      const hashedPassword = await hash(
        userData.password,
        this.configService.get('encryption.saltRounds'),
      );
      return await User.create({ ...userData, password: hashedPassword });
    } catch (e) {
      throw new NotFoundException('Unable to create user with such email');
    }
  }
  public async verifyUser(userData: authDto) {
    const user = await this.findUser(userData.email);
    if (!user) throw new NotFoundException('Incorrect password or email');
    const isPasswordCorrect = await compare(userData.password, user.password);
    if (!isPasswordCorrect)
      throw new NotFoundException('Incorrect password or email');
    return true;
  }
  public async findUser(userEmail: string) {
    return User.findOne({ where: { email: userEmail } });
  }
}
