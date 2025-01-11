import { Injectable, Inject } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Equal, Not, Repository } from 'typeorm';
import { ResultCode } from 'src/core/common/constant';
import { ConfigService } from '@nestjs/config';
import { WinstonCustom } from 'src/core/log/winstonCustom';
import { PaginationDto } from './dto/pagination.dto';
import { SearchConditionDto } from './dto/search-condition.dto';
import { PermissionIdDto } from './dto/permission-id.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { BatchDeletePermissionDto } from './dto/batch-delete-permission.dto';

@Injectable()
export class PermissionService {
  logger: any;
  constructor(
    private configService: ConfigService,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @Inject('WinstonCustom') private winstonCustom: WinstonCustom,
  ) {
    this.logger = winstonCustom.genLogger('PermissionService');
  }

  // 新增权限
  async create(createPermissionDto: CreatePermissionDto) {
    // 判断权限是否存在
    const exist = await this._permissionExist(createPermissionDto);
    if (typeof exist === 'boolean') {
      // 数据入库
      return await this._savePermission(createPermissionDto);
    } else if (exist.code) {
      return exist;
    }
  }

  // 判断权限是否已存在函数抽离
  async _permissionExist(createPermissionDto) {
    try {
      // 检查 permissionName 是否存在
      const permissionByName = await this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.permissionName = :permissionName', {
          permissionName: createPermissionDto.permissionName,
        })
        .getOne();

      if (permissionByName) {
        return { code: ResultCode.PERMISSION_ALREADY_EXISTS };
      }

      // 检查 permissionCode 是否存在
      const permissionByCode = await this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.permissionCode = :permissionCode', {
          permissionCode: createPermissionDto.permissionCode,
        })
        .getOne();

      if (permissionByCode) {
        return { code: ResultCode.PERMISSION_CODE_ALREADY_EXISTS };
      }

      // 检查 route 是否存在
      if (createPermissionDto.route) {
        const permissionByRoute = await this.permissionRepository
          .createQueryBuilder('permission')
          .where('permission.route = :route', {
            route: createPermissionDto.route,
          })
          .getOne();

        if (permissionByRoute) {
          return { code: ResultCode.ROUTE_ALREADY_EXISTS };
        }
      }

      // 如果所有字段都不存在，则返回 false
      return false;
    } catch (e) {
      this.logger.error(e);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }
  // 权限入库函数抽离
  async _savePermission(createPermissionDto) {
    try {
      // 保存权限
      await this.permissionRepository.save(createPermissionDto);
      return {
        code: ResultCode.PERMISSION_CREATED_SUCCESS,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        code: ResultCode.USER_CREATED_FAILED,
      };
    }
  }

  // 获取所有权限
  async findAll(
    paginationDto: PaginationDto,
    searchConditionDto: SearchConditionDto,
  ) {
    try {
      const { page, limit } = paginationDto;
      const skip = (page - 1) * limit;
      const queryBuilder =
        this.permissionRepository.createQueryBuilder('permission');

      const conditions = [];

      if (searchConditionDto.permissionCode) {
        conditions.push(`permission.permissionCode LIKE :permissionCode`);
      }
      if (searchConditionDto.permissionName) {
        conditions.push(`permission.permissionName LIKE :permissionName`);
      }
      if (searchConditionDto.route) {
        conditions.push(`permission.route LIKE :route`);
      }
      if (searchConditionDto.type) {
        conditions.push(`permission.type = :type`);
      }

      if (conditions.length > 0) {
        queryBuilder.where(conditions.join(' AND '), {
          permissionCode: `%${searchConditionDto.permissionCode}%`,
          permissionName: `%${searchConditionDto.permissionName}%`,
          route: `%${searchConditionDto.route}%`,
          type: searchConditionDto.type,
        });
      }

      const permissions = await queryBuilder.skip(skip).take(limit).getMany();
      const total = await queryBuilder.getCount();

      return {
        code: ResultCode.PERMISSION_FINDALL_SUCCESS,
        data: {
          total,
          permissions: this._buildTree(permissions),
        },
      };
    } catch (e) {
      this.logger.error(
        'queryBuilder.skip(skip).take(limit).getMany() ' + e.message,
      );
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  _buildTree(permissions) {
    // 创建一个映射，用于存储每个节点
    const nodeMap = new Map<number, any>();

    // 遍历permissions数组，将每个节点添加到映射中
    permissions.forEach((node) => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // 再次遍历permissions数组，将每个节点根据其pid关联到对应的父节点的children属性中
    permissions.forEach((node) => {
      if (node.pid !== 0) {
        const parentNode = nodeMap.get(node.pid);
        if (parentNode) {
          parentNode.children.push(nodeMap.get(node.id));
        }
      }
    });

    // 从映射中提取所有根节点（pid为0的节点）作为树的根
    const treeData = Array.from(nodeMap.values()).filter(
      (node) => node.pid === 0,
    );
    return treeData;
  }

  // 根据id查询单个权限
  async findOne(searchUserDto: PermissionIdDto) {
    try {
      const data = await this.permissionRepository.findOne({
        where: { id: searchUserDto.id },
      });
      return { code: ResultCode.PERMISSION_FINDONE_SUCCESS, data: [data] };
    } catch (e) {
      this.logger.error('permissionRepository.findOne' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 更新权限
  async update(
    permissionIdDto: PermissionIdDto,
    updatePermissionDto: UpdatePermissionDto,
  ) {
    try {
      // 检查 permissionName 是否存在
      if (
        updatePermissionDto.permissionName &&
        (await this.checkUnique(
          'permissionName',
          updatePermissionDto.permissionName,
          permissionIdDto.id,
        ))
      ) {
        return { code: ResultCode.PERMISSION_ALREADY_EXISTS };
      }

      // 检查 permissionCode 是否存在
      if (
        updatePermissionDto.permissionCode &&
        (await this.checkUnique(
          'permissionCode',
          updatePermissionDto.permissionCode,
          permissionIdDto.id,
        ))
      ) {
        return { code: ResultCode.PERMISSION_CODE_ALREADY_EXISTS };
      }

      // 检查 route 是否存在
      if (
        updatePermissionDto.route &&
        (await this.checkUnique(
          'route',
          updatePermissionDto.route,
          permissionIdDto.id,
        ))
      ) {
        return { code: ResultCode.ROUTE_ALREADY_EXISTS };
      }

      // 更新权限
      await this.permissionRepository.update(
        permissionIdDto.id,
        updatePermissionDto,
      );

      return { code: ResultCode.PERMISSION_UPDATED_SUCCESS };
    } catch (e) {
      this.logger.error('permissionRepository.update' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 删除权限
  async remove(deletePermissionDto: PermissionIdDto) {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id: deletePermissionDto.id },
      });
      if (!permission) {
        return { code: ResultCode.PERMISSION_NOT_FOUND };
      }
      await this.permissionRepository.delete(deletePermissionDto.id);
      return { code: ResultCode.PERMISSION_DELETED_SUCCESS };
    } catch (e) {
      this.logger.error('permissionRepository.remove' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 批量删除权限
  async batchRemove(batchDeletePermissionDto: BatchDeletePermissionDto) {
    try {
      const { ids } = batchDeletePermissionDto;
      await this.permissionRepository.delete(ids);
      return {
        code: ResultCode.PERMISSION_BATCH_DELETE_SUCCESS,
        data: { deleted: ids.length },
      };
    } catch (e) {
      this.logger.error('usersRepository.batchRemove' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  // 检测字段是否存在
  private async checkUnique(
    fieldName: string,
    fieldValue: string,
    permissionId: number,
  ): Promise<boolean> {
    const existingPermission = await this.permissionRepository.findOne({
      where: {
        [fieldName]: fieldValue,
        id: Not(Equal(permissionId)), // 排除当前权限
      },
    });

    return !!existingPermission;
  }
}
