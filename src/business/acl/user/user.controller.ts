import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 新增用户
  @Post()
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(ClassSerializerInterceptor) // 过滤x字段
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 获取所有用户：可以包括分页参数（如 page 和 limit）
  @Get()
  @UseInterceptors(ClassSerializerInterceptor) // 过滤x字段
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  // 获取某个用户
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // // 更新用户
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // // 删除用户
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
