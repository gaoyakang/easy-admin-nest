import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsUrl,
  Length,
} from 'class-validator';

export class BaseDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  @Length(4, 12, { message: 'username长度必须在5到12个字符之间' })
  username: string;

  @ApiProperty({ description: '昵称' })
  @Length(5, 12, { message: 'nickname长度必须在5到12个字符之间' })
  nickname?: string;

  @ApiProperty({ description: '头像' })
  @IsUrl({}, { message: 'avatar必须是一个有效的URL' })
  avatar?: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail({}, { message: 'email格式错误' })
  email?: string;

  @ApiProperty({ description: '手机号' })
  @IsPhoneNumber('CN', { message: 'phone格式错误' })
  phone?: string;

  @ApiProperty({ description: '创建时间' })
  createTime?: Date;

  @ApiProperty({ description: '更新时间' })
  updateTime?: Date;
}
