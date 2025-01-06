import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchConditionDto {
  @ApiProperty({
    description: '角色名称',
    example: '超级管理员',
    required: false,
  })
  @IsOptional()
  @IsString()
  rolename?: string;

  @ApiProperty({
    description: '角色标识',
    example: 'superAdmin',
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string;
}
