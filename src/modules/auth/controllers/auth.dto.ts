import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class authDto {
  @ApiProperty({
    type: String,
    description: 'User email',
    default: 'someEmail@rambler.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    default: 'some_password',
  })
  @IsNotEmpty()
  password: number;
}
