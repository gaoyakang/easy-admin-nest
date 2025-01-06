import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BaseDto {
  @ApiProperty({ description: '创建时间' })
  @IsOptional()
  createTime?: Date;

  @ApiProperty({ description: '更新时间' })
  @IsOptional()
  updateTime?: Date;
}
