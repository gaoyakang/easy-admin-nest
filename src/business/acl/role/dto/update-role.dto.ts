import { IsOptional, Length } from 'class-validator';
import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateRoleDto extends BaseDto {
  @ApiProperty({ description: '角色名' })
  @IsOptional()
  @Length(2, 12, { message: 'rolename长度必须在2到12个字符之间' })
  rolename?: string;

  @ApiProperty({ description: '角色标识' })
  @IsOptional()
  @Length(2, 15, { message: 'label长度必须在2到15个字符之间' })
  label?: string;
}
