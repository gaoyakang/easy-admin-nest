import {
  Body,
  Controller,
  Delete,
  // Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchConditionDto } from './dto/search-condition.dto';
import { RoleIdDto } from './dto/role-id.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BatchDeleteRoleDto } from './dto/batch-delete-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // 新增角色
  // 支持 /role
  @Post()
  @ApiBody({ type: CreateRoleDto })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  // 获取所有角色：可以包括分页参数（如 page 和 limit）
  // 支持：/role/page/limit
  // 支持：/role/page/limit?keyword=a
  @Get('/:page/:limit')
  @ApiBody({ type: CreateRoleDto })
  findAll(
    @Param() paginationDto: PaginationDto,
    @Query() searchConditionDto?: SearchConditionDto,
  ) {
    return this.roleService.findAll(paginationDto, searchConditionDto);
  }

  // 获取某个角色
  // 支持：/role/id
  @Get(':id')
  findOne(@Param() searchRoleDto: RoleIdDto) {
    return this.roleService.findOne(searchRoleDto);
  }

  // 更新角色
  // 支持：/role/id
  @Patch(':id')
  @ApiBody({ type: RoleIdDto })
  update(
    @Param() updateRoleIdDto: RoleIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(updateRoleIdDto, updateRoleDto);
  }

  // 删除角色
  // 支持：/role/id
  @Delete(':id')
  @ApiBody({ type: RoleIdDto })
  remove(@Param() deleteUserDto: RoleIdDto) {
    return this.roleService.remove(deleteUserDto);
  }

  // 批量删除用户
  // 支持：/role
  @Delete()
  @ApiBody({ type: BatchDeleteRoleDto })
  batchRemove(@Body() deleteRoleDto: BatchDeleteRoleDto) {
    return this.roleService.batchRemove(deleteRoleDto);
  }

  // 分配权限
  // 支持 /role/assignPermission
  @Post('/assignPermission/:id')
  assignRole(
    @Param() assignPermissionIdDto: RoleIdDto,
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    return this.roleService.assignPermission(
      assignPermissionIdDto,
      assignPermissionDto,
    );
  }
}
