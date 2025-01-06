import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchConditionDto {
  @ApiProperty({ description: '搜索词', example: 'a', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;
}
