import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Equal, Not, Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { WinstonCustom } from 'src/core/log/winstonCustom';
import { CreateRoleDto } from './dto/create-role.dto';
import { ResultCode, ResultMessages } from 'src/core/common/constant';
import { PaginationDto } from './dto/pagination.dto';
import { SearchConditionDto } from './dto/search-condition.dto';
import { RoleIdDto } from './dto/role-id.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BatchDeleteRoleDto } from './dto/batch-delete-role.dto';

@Injectable()
export class RoleService {
  logger: any;
  constructor(
    private configService: ConfigService,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @Inject('WinstonCustom') private winstonCustom: WinstonCustom,
  ) {
    this.logger = winstonCustom.genLogger('RoleService');
  }
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

      const roles = await queryBuilder.skip(skip).take(limit).getMany();
      const total = await queryBuilder.getCount();

      return {
        code: ResultCode.ROLE_FINDALL_SUCCESS,
        data: {
          total,
          roles,
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
