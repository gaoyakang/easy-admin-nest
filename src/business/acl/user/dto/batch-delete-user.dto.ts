import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class BatchDeleteUserDto {
  @ApiProperty({ description: '用户 ID 列表', example: [1, 2, 3] })
  @IsArray({ message: 'ids必须为数组' })
  @Type(() => Number)
  @Transform(({ obj }) => {
    if (obj.ids instanceof Array) {
      return obj.ids;
    } else {
      // 转为数组
      const data = JSON.parse(obj.ids);
      return data;
    }
  })
  ids: number[];
}
