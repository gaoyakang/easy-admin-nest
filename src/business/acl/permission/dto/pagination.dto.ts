import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({ description: '位置' })
  @IsNumber({}, { message: 'page必须是数字' })
  @Min(1, { message: '页码必须大于等于1' })
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10)) //自动转为10进制数
  page: number;

  @ApiProperty({ description: '条数' })
  @IsNumber({}, { message: 'limit必须是数字' })
  @Min(1, { message: 'limit必须大于等于1' })
  @Max(999, { message: 'limit不能超过999' })
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10)) //自动转为10进制数
  limit: number;
}
