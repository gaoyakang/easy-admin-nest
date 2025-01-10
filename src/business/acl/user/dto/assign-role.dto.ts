import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ description: '角色 ID 列表', example: [1, 2, 3] })
  @IsArray({ message: 'ids必须为数组' })
  @Type(() => Number)
  @Transform(({ obj }) => {
    let data;
    if (obj.ids instanceof Array) {
      data = obj.ids;
    } else {
      // 转为数组
      data = JSON.parse(obj.ids);
    }
    return data;
  })
  ids: number[];
}
