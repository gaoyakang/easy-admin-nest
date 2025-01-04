import { IsNotEmpty, Length } from 'class-validator';
import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto extends BaseDto {
  @ApiProperty({ description: '密码' })
  @IsNotEmpty()
  @Length(6, 15, { message: 'password长度必须在6到15个字符之间' })
  password: string;
}
