import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchConditionDto {
  @ApiProperty({ description: '权限码', example: 'a', required: false })
  @IsOptional()
  @IsString()
  permissionCode?: string;

  @ApiProperty({ description: '权限名称', example: 'a', required: false })
  @IsOptional()
  @IsString()
  permissionName?: string;

  @ApiProperty({ description: '权限类型', example: 'a', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '权限路由', example: 'a', required: false })
  @IsOptional()
  @IsString()
  route?: string;
}
