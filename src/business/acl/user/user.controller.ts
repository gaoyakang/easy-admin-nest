import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { SearchConditionDto } from './dto/search-condition.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 新增用户
  // 支持 /user
  @Post()
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(ClassSerializerInterceptor) // 过滤x字段
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 获取所有用户：可以包括分页参数（如 page 和 limit）
  // 支持：/user/page/limit
  // 支持：/user/page/limit?keyword=a
  @Get('/:page/:limit')
  @ApiBody({ type: CreateUserDto })
  findAll(
    @Param() paginationDto: PaginationDto,
    @Query() searchConditionDto?: SearchConditionDto,
  ) {
    return this.userService.findAll(paginationDto, searchConditionDto);
  }

  // 获取某个用户
  // 支持：/user/id
  @Get(':id')
  findOne(@Param() searchUserDto: SearchUserDto) {
    return this.userService.findOne(searchUserDto);
  }

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
