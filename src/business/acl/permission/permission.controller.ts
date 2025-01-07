import {
  Controller,
  // Get,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  // Param,
  // Query,
  // Delete,
  // Patch,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchConditionDto } from './dto/search-condition.dto';
import { PermissionIdDto } from './dto/permission-id.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { BatchDeletePermissionDto } from './dto/batch-delete-permission.dto';
// import { PaginationDto } from './dto/pagination.dto';
// import { UserIdDto } from './dto/user-id.dto';
// import { SearchConditionDto } from './dto/search-condition.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { BatchDeleteUserDto } from './dto/batch-delete-user.dto';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // 新增权限
  // 支持 /permission
  @Post()
  @ApiBody({ type: CreatePermissionDto })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  // 获取所有权限：可以包括分页参数（如 page 和 limit）
  // 支持：/permission/page/limit
  // 支持：/permission/page/limit?permissionName=&permissionCode=&type=&route=
  @Get('/:page/:limit')
  findAll(
    @Param() paginationDto: PaginationDto,
    @Query() searchConditionDto?: SearchConditionDto,
  ) {
    return this.permissionService.findAll(paginationDto, searchConditionDto);
  }

  // 获取某个权限
  // 支持：/permission/id
  @Get(':id')
  findOne(@Param() searchPermissionDto: PermissionIdDto) {
    return this.permissionService.findOne(searchPermissionDto);
  }

  // 更新权限
  // 支持：/permission/id
  @Patch(':id')
  @ApiBody({ type: UpdatePermissionDto })
  update(
    @Param() updatePermissionIdDto: PermissionIdDto,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(
      updatePermissionIdDto,
      updatePermissionDto,
    );
  }

  // 删除权限
  // 支持：/permission/id
  @Delete(':id')
  @ApiBody({ type: PermissionIdDto })
  remove(@Param() deletePermissionDto: PermissionIdDto) {
    return this.permissionService.remove(deletePermissionDto);
  }

  // 批量删除权限
  // 支持：/permission
  @Delete()
  @ApiBody({ type: BatchDeletePermissionDto })
  batchRemove(@Body() deletePermissionDto: BatchDeletePermissionDto) {
    return this.permissionService.batchRemove(deletePermissionDto);
  }
}
