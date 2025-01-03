import {
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  Length,
  IsUrl,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 12, { message: 'username长度必须在5到12个字符之间' })
  username: string;

  @IsNotEmpty()
  @Length(6, 15, { message: 'password长度必须在6到15个字符之间' })
  password: string;

  @Length(5, 12, { message: 'nickname长度必须在5到12个字符之间' })
  nickname?: string;

  @IsUrl({}, { message: 'avatar必须是一个有效的URL' })
  avatar?: string;

  @IsEmail({}, { message: 'email格式错误' })
  email?: string;

  @IsPhoneNumber('CN', { message: 'phone格式错误' })
  phone?: string;
}
