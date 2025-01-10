import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Equal, Not, Repository } from 'typeorm';

import { WinstonCustom } from 'src/core/log/winstonCustom';
import { CreateRoleDto } from './dto/create-role.dto';
import { ResultCode, ResultMessages } from 'src/core/common/constant';
import { PaginationDto } from './dto/pagination.dto';
import { SearchConditionDto } from './dto/search-condition.dto';
import { RoleIdDto } from './dto/role-id.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BatchDeleteRoleDto } from './dto/batch-delete-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {
  logger: any;
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @Inject('WinstonCustom') private winstonCustom: WinstonCustom,
  ) {
    this.logger = winstonCustom.genLogger('RoleService');
  }

  // 获取角色权限
  async getAssignPermission(roleIdDto: RoleIdDto) {
    try {
      // 获取角色的所有权限
      const role = await this.rolesRepository.findOne({
        where: { id: roleIdDto.id },
        relations: ['permissions'],
      });
      if (!role) {
        return { code: ResultCode.ROLE_NOT_FOUND }; // 角色不存在的错误码
      }

      const assignRoles = role.permissions.map((permission) => ({
        id: permission.id,
        pid: permission.pid,
        permissionName: permission.permissionName,
        permissionCode: permission.permissionCode,
        type: permission.type,
        route: permission.route,
        createTime: permission.createTime,
        updateTime: permission.updateTime,
      }));

      // 获取系统中所有的权限
      const allRoles = await this.permissionRepository.find({
        select: [
          'id',
          'pid',
          'permissionName',
          'permissionCode',
          'type',
          'route',
          'createTime',
          'updateTime',
        ], // 选择需要的字段
      });

      // 构建树形结构并设置 select 属性
      // 在返回给前端某个角色对应的权限时，如果某权限的 “用户拥有的子权限数量” 和 “该权限的所有子权限数量”相同时，
      // 将该权限select=true，否则select=false
      // 在前端向后端请求实现赋予某角色权限时，将要赋予的权限的所有父权限也全赋予给该角色
      const allRolesTree = this._buildTree(
        allRoles,
        assignRoles as Permission[],
      );

      // 处理数据
      return {
        code: ResultCode.USER_GET_ASSIGN_ROLE_SUCCESS,
        data: allRolesTree,
      };
    } catch (e) {
      this.logger.error('getAssignPermission failed', e);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 构建tree结构
  _buildTree(items: Permission[], assignRoles: Permission[]): Permission[] {
    const itemMap: { [key: number]: Permission } = {};
    const tree: Permission[] = [];

    // 创建一个映射，以便快速查找
    for (const item of items) {
      itemMap[item.id] = {
        ...item,
        children: [],
        select: false,
      };
    }

    // 构建树形结构
    for (const item of items) {
      if (item.pid === 0) {
        tree.push(itemMap[item.id]); // 如果 pid 为 0，说明是根节点
      } else {
        const parent = itemMap[item.pid];
        if (parent) {
          parent.children.push(itemMap[item.id]); // 将当前项添加到其父节点的 children 中
        }
      }
    }

    // 设置 select 属性
    for (const assignRole of assignRoles) {
      const node = itemMap[assignRole.id];
      if (node) {
        node.select = true;
      }
    }

    return tree; // 返回构建好的树形结构
  }
  // _buildTree(items: Permission[], assignRoles: Permission[]): Permission[] {
  //   const itemMap: { [key: number]: Permission } = {};
  //   const tree: Permission[] = [];

  //   // 创建一个映射，以便快速查找
  //   for (const item of items) {
  //     itemMap[item.id] = {
  //       ...item,
  //       children: [],
  //       select: false,
  //     };
  //   }

  //   // 构建树形结构
  //   for (const item of items) {
  //     if (item.pid === 0) {
  //       tree.push(itemMap[item.id]); // 如果 pid 为 0，说明是根节点
  //     } else {
  //       const parent = itemMap[item.pid];
  //       if (parent) {
  //         parent.children.push(itemMap[item.id]); // 将当前项添加到其父节点的 children 中
  //       }
  //     }
  //   }

  //   // 设置 select 属性
  //   for (const assignRole of assignRoles) {
  //     const node = itemMap[assignRole.id];
  //     if (node) {
  //       node.select = true;
  //     }
  //   }

  //   return tree; // 返回构建好的树形结构
  // }

  // 新增角色
  async create(createRoleDto: CreateRoleDto) {
    // 判断角色是否存在
    const exist = await this._roleExist(createRoleDto);
    if (!exist) {
      // 数据入库
      return await this._saveRole(createRoleDto);
    } else {
      return exist;
    }
  }

  // 获取所有角色
  async findAll(
    paginationDto: PaginationDto,
    searchConditionDto: SearchConditionDto,
  ) {
    try {
      const { page, limit } = paginationDto;
      const skip = (page - 1) * limit;
      const queryBuilder = this.rolesRepository.createQueryBuilder('role');

      const conditions = [];
      const params = {
        rolename: '',
        label: '',
      };

      if (searchConditionDto.rolename) {
        conditions.push('role.rolename LIKE :rolename');
        params.rolename = `%${searchConditionDto.rolename}%`;
      }

      if (searchConditionDto.label) {
        conditions.push('role.label LIKE :label');
        params.label = `%${searchConditionDto.label}%`;
      }

      if (conditions.length > 0) {
        queryBuilder.where(conditions.join(' OR '), params);
      }

      // 加载关联的 permissions
      queryBuilder.leftJoinAndSelect('role.permissions', 'permissions');

      const roles = await queryBuilder.skip(skip).take(limit).getMany();
      const total = await queryBuilder.getCount();

      return {
        code: ResultCode.ROLE_FINDALL_SUCCESS,
        data: {
          total,
          records: roles,
        },
      };
    } catch (e) {
      this.logger.error(
        'queryBuilder.skip(skip).take(limit).getMany() ' + e.message,
      );
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 根据id查询单个角色
  async findOne(searchRoleDto: RoleIdDto) {
    try {
      const data = await this.rolesRepository.findOne({
        where: { id: searchRoleDto.id },
      });
      return { code: ResultCode.ROLE_FINDONE_SUCCESS, data: [data] };
    } catch (e) {
      this.logger.error('rolesRepository.findOne' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 更新角色
  async update(roleIdDto: RoleIdDto, updateRoleDto: UpdateRoleDto) {
    try {
      // 检查 rolename 是否存在
      if (
        updateRoleDto.rolename &&
        (await this.checkUnique(
          'rolename',
          updateRoleDto.rolename,
          roleIdDto.id,
        ))
      ) {
        return { code: ResultCode.ROLENAME_ALREADY_EXISTS };
      }

      // 检查 label 是否存在
      if (
        updateRoleDto.label &&
        (await this.checkUnique('label', updateRoleDto.label, roleIdDto.id))
      ) {
        return { code: ResultCode.ROLELABEL_ALREADY_EXISTS };
      }

      // 角色入库
      await this.rolesRepository.update(roleIdDto.id, updateRoleDto);
      return { code: ResultCode.ROLE_UPDATED_SUCCESS };
    } catch (e) {
      this.logger.error('rolesRepository.update' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 删除角色
  async remove(deleteRoleDto: RoleIdDto) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id: deleteRoleDto.id },
      });
      if (!role) {
        return { code: ResultCode.ROLE_NOT_FOUND };
      }

      // TODO: 加上事务
      //  先把中间表的相关数据清除
      this.rolePermissionRepository.delete({ roleId: deleteRoleDto.id });
      // 然后再删除角色
      await this.rolesRepository.delete(deleteRoleDto.id);
      return { code: ResultCode.ROLE_DELETED_SUCCESS };
    } catch (e) {
      this.logger.error('rolesRepository.remove' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 批量删除角色
  async batchRemove(batchDeleteRoleDto: BatchDeleteRoleDto) {
    try {
      const { ids } = batchDeleteRoleDto;
      //  TODO: 加事务
      // 提前将role_permission相关的数据清空
      await this.rolePermissionRepository.delete(ids);
      // 然后将角色删除
      const result = await this.rolesRepository.delete(ids);
      if (result.affected === 0) {
        return {
          code: ResultCode.ROLE_BATCH_DELETE_SUCCESS,
          data: { deleted: ids.length },
        };
      }

      return {
        code: ResultCode.ROLE_BATCH_DELETE_SUCCESS,
        data: { deleted: ids.length },
      };
    } catch (e) {
      this.logger.error('rolesRepository.batchRemove' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 为角色分配权限
  async assignPermission(
    assignPermissionIdDto: RoleIdDto,
    assignPermissionDto: AssignPermissionDto,
  ) {
    try {
      const { id } = assignPermissionIdDto;
      const { ids } = assignPermissionDto;
      // 判断当前id对应的角色是否存在
      const role = await this.rolesRepository.findOne({ where: { id } });
      if (!role) {
        return { code: ResultCode.ROLE_NOT_FOUND }; // 角色不存在的错误码
      }
      // 删除角色现有的权限关系
      await this.rolePermissionRepository.delete({ roleId: id });
      // 插入新的权限关系
      const rolePermission = ids.map((permissionId) => ({
        roleId: id,
        permissionId: permissionId,
      }));
      await this.rolePermissionRepository.insert(rolePermission);

      return { code: ResultCode.ROLE_ASSIGN_PERMISSION_SUCCESS };
    } catch (e) {
      this.logger.error('assignPermission failed', e);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 判断角色是否重复
  async _roleExist(createRoleDto) {
    try {
      // 检查 rolename 是否存在
      const roleByName = await this.rolesRepository.findOne({
        where: { rolename: createRoleDto.rolename },
      });

      // 检查 label 是否存在
      const roleByLabel = await this.rolesRepository.findOne({
        where: { label: createRoleDto.label },
      });

      if (roleByName && roleByLabel) {
        // 如果 rolename 和 label 都存在
        return { code: ResultCode.ROLENAME_AND_LABEL_ALREADY_EXISTS };
      } else if (roleByName) {
        // 如果只有 rolename 存在
        return { code: ResultCode.ROLENAME_ALREADY_EXISTS };
      } else if (roleByLabel) {
        // 如果只有 label 存在
        return { code: ResultCode.ROLELABEL_ALREADY_EXISTS };
      } else {
        // 如果 rolename 和 label 都不存在
        return false;
      }
    } catch (e) {
      this.logger.error(ResultMessages[ResultCode.ROLE_SAVE_FAILED] + e);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 角色入库
  async _saveRole(createRoleDto) {
    try {
      // 保存角色
      await this.rolesRepository.save(createRoleDto);
      // 定义操作码和对应的提示信息，每次返回data和操作吗，自动帮我包装返回数据
      return {
        code: ResultCode.ROLE_CREATED_SUCCESS,
      };
    } catch (e) {
      this.logger.error(ResultMessages[ResultCode.ROLE_SAVE_FAILED] + e);
      return {
        code: ResultCode.SERVER_EXCEPTION,
      };
    }
  }

  // 检测字段是否存在
  private async checkUnique(
    fieldName: string,
    fieldValue: string,
    roleId: number,
  ): Promise<boolean> {
    const exist = await this.rolesRepository.findOne({
      where: {
        [fieldName]: fieldValue,
        id: Not(Equal(roleId)), // 排除当前角色
      },
    });
    return !!exist;
  }
}
