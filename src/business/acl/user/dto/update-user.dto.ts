import { IsOptional, Length } from 'class-validator';
import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto extends BaseDto {
  @ApiProperty({ description: '用户名' })
  @IsOptional()
  @Length(4, 12, { message: 'username长度必须在5到12个字符之间' })
  username?: string;

  @ApiProperty({ description: '密码' })
  @IsOptional()
  @Length(6, 15, { message: 'password长度必须在6到15个字符之间' })
  password?: string;
}
