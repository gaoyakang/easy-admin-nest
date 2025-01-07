import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PermissionIdDto {
  @ApiProperty({ description: '权限id' })
  @IsInt({ message: 'id必须为整数' })
  @IsNotEmpty({ message: 'id必须非空' })
  @IsNumber({}, { message: 'id必须是数字' })
  @Min(1, { message: 'id必须大于等于1' })
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10)) //自动转为10进制数
  id: number;
}
