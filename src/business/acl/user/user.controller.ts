import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query,
  Delete,
  Patch,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { UserIdDto } from './dto/user-id.dto';
import { SearchConditionDto } from './dto/search-condition.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BatchDeleteUserDto } from './dto/batch-delete-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 新增用户
  // 支持 /user
  // @isPublic() // 放行, 不检测token
  @Post()
  @ApiBody({ type: CreateUserDto })
  @SetMetadata('requiredPermissions', ['btn.User.add']) // 用于检查用户是否有使用该接口的权限
  @UseInterceptors(ClassSerializerInterceptor) // 过滤x字段
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 获取所有用户：可以包括分页参数（如 page 和 limit）
  // 支持：/user/page/limit
  // 支持：/user/page/limit?keyword=a
  @SetMetadata('requiredPermissions', ['btn.User.queryAll']) // 用于检查用户是否有使用该接口的权限
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
  @SetMetadata('requiredPermissions', ['btn.User.queryOne']) // 用于检查用户是否有使用该接口的权限
  findOne(@Param() searchUserDto: UserIdDto) {
    return this.userService.findOne(searchUserDto);
  }

  // 更新用户
  // 支持：/user/id
  @Patch(':id')
  @ApiBody({ type: UserIdDto })
  @SetMetadata('requiredPermissions', ['btn.User.update']) // 用于检查用户是否有使用该接口的权限
  update(
    @Param() updateUserIdDto: UserIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(updateUserIdDto, updateUserDto);
  }

  // 删除用户
  // 支持：/user/id
  @Delete(':id')
  @ApiBody({ type: UserIdDto })
  @SetMetadata('requiredPermissions', ['btn.User.deleteOne']) // 用于检查用户是否有使用该接口的权限
  remove(@Param() deleteUserDto: UserIdDto) {
    return this.userService.remove(deleteUserDto);
  }

  // 批量删除用户
  // 支持：/user
  @Delete()
  @ApiBody({ type: BatchDeleteUserDto })
  @SetMetadata('requiredPermissions', ['btn.User.batchDelete']) // 用于检查用户是否有使用该接口的权限
  batchRemove(@Body() deleteUserDto: BatchDeleteUserDto) {
    return this.userService.batchRemove(deleteUserDto);
  }

  // 分配角色
  // 支持 /user/assignRole
  @Post('/assignRole/:id')
  @SetMetadata('requiredPermissions', ['btn.User.assignRole']) // 用于检查用户是否有使用该接口的权限
  assignRole(
    @Param() assignRoleIdDto: UserIdDto,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return this.userService.assignRole(assignRoleIdDto, assignRoleDto);
  }
}
