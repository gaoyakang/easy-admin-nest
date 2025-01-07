import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';
import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
export class UpdatePermissionDto extends BaseDto {
  @ApiProperty({ description: '权限名' })
  @IsOptional()
  @Length(4, 15, { message: 'permissionName长度必须在2到15个字符之间' })
  permissionName: string;

  @ApiProperty({ description: '权限码' })
  @IsOptional()
  @Length(2, 15, { message: 'permissionCode长度必须在2到15个字符之间' })
  permissionCode?: string;

  @ApiProperty({ description: '父级权限id' })
  @IsNotEmpty({ message: 'pid不能为空' })
  @IsNumber({}, { message: 'pid必须为数字' })
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10)) //自动转为10进制数
  pid: number;

  @ApiProperty({ description: '权限类型' })
  @IsNotEmpty({ message: 'type不能为空' })
  type: number;

  @ApiProperty({ description: '权限路由' })
  @IsOptional()
  route?: string;
}
