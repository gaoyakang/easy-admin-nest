import { Inject, Injectable } from '@nestjs/common';
import { ResultCode } from './core/common/constant';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { DataSource, Repository } from 'typeorm';
import { User } from './business/acl/user/entities/user.entity';
import { CreateUserDto } from './business/acl/user/dto/create-user.dto';
import { CreateRoleDto } from './business/acl/role/dto/create-role.dto';
import { Role } from './business/acl/role/entities/role.entity';
import { CreatePermissionDto } from './business/acl/permission/dto/create-permission.dto';
import { Permission } from './business/acl/permission/entities/permission.entity';
import { UserRole } from './business/acl/user/entities/user-role.entity';
import { RolePermission } from './business/acl/role/entities/role-permission.entity';
import { UserIdDto } from './business/acl/user/dto/user-id.dto';
import { AssignRoleDto } from './business/acl/user/dto/assign-role.dto';
import { RoleIdDto } from './business/acl/role/dto/role-id.dto';
import { AssignPermissionDto } from './business/acl/role/dto/assign-permission.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,

    //  数据库
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  getHello() {
    return { code: ResultCode.USER_WELCOME };
  }

  // 初始化数据库
  async init() {
    // 设置表主键从0自增
    this._setAutoIncrementToZero('user').catch((error) => console.error(error));
    this._setAutoIncrementToZero('role').catch((error) => console.error(error));
    this._setAutoIncrementToZero('permission').catch((error) =>
      console.error(error),
    );
    this._setAutoIncrementToZero('user_role').catch((error) =>
      console.error(error),
    );
    this._setAutoIncrementToZero('role_permission').catch((error) =>
      console.error(error),
    );
    // 用户：admin，test
    // 角色：超级管理员，普通用户
    // 权限：新增，删除单个，批量删除，修改，查询单个，查询所有，分配

    // 用户
    const hashedPassword =
      '$2b$10$qn9rxy3QZVJrxuINdJsZXu7x3rCPcRAA9YnVI3OQP2VpCgcmpFNY.'; //111111
    const user1: CreateUserDto = {
      username: 'admin',
      password: hashedPassword,
      nickname: 'admin',
      phone: '18888888888',
      email: '3060900000@qq.com',
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    };
    const user2: CreateUserDto = {
      username: 'test',
      password: hashedPassword,
      nickname: 'test',
      phone: '18888888888',
      email: '3060900000@qq.com',
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    };
    await this.usersRepository.save(user1);
    await this.usersRepository.save(user2);
    // 角色
    const role1: CreateRoleDto = {
      rolename: '超级管理员',
      label: 'superAdmin',
    };
    const role2: CreateRoleDto = {
      rolename: '普通用户',
      label: 'user',
    };
    await this.rolesRepository.save(role1);
    await this.rolesRepository.save(role2);
    // 权限
    // 0级
    const permission0: CreatePermissionDto = {
      permissionName: '所有权限',
      pid: 0,
      route: '',
      type: 1,
      permissionCode: 'All',
    };
    // 一级-2
    const permission1: CreatePermissionDto = {
      permissionName: '系统管理',
      pid: 1,
      route: '/system',
      type: 1,
      permissionCode: 'System',
    };
    const permission2: CreatePermissionDto = {
      permissionName: '系统监控',
      pid: 1,
      route: '/monitor',
      type: 1,
      permissionCode: 'Monitor',
    };
    const permission3: CreatePermissionDto = {
      permissionName: '系统服务',
      pid: 1,
      route: '/service',
      type: 1,
      permissionCode: 'Service',
    };
    const permission4: CreatePermissionDto = {
      permissionName: '系统工具',
      pid: 1,
      route: '/tool',
      type: 1,
      permissionCode: 'Tool',
    };

    // 二级-6
    const permission5: CreatePermissionDto = {
      permissionName: '用户管理',
      pid: 2,
      route: '/system/user',
      type: 2,
      permissionCode: 'User',
    };
    const permission6: CreatePermissionDto = {
      permissionName: '角色管理',
      pid: 2,
      route: '/system/role',
      type: 2,
      permissionCode: 'Role',
    };
    const permission7: CreatePermissionDto = {
      permissionName: '权限管理',
      pid: 2,
      route: '/system/permission',
      type: 2,
      permissionCode: 'Permission',
    };
    const permission8: CreatePermissionDto = {
      permissionName: '登陆日志',
      pid: 3,
      route: '/monitor/loginlog',
      type: 2,
      permissionCode: 'LoginLog',
    };
    const permission9: CreatePermissionDto = {
      permissionName: '文件管理',
      pid: 4,
      route: '/service/file',
      type: 2,
      permissionCode: 'File',
    };
    const permission10: CreatePermissionDto = {
      permissionName: '代码生成',
      pid: 5,
      route: '/tool/gencode',
      type: 2,
      permissionCode: 'GenCode',
    };

    // 三级-12
    const permission11: CreatePermissionDto = {
      permissionName: '新增用户',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.add',
    };
    const permission12: CreatePermissionDto = {
      permissionName: '删除单个用户',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.deleteOne',
    };
    const permission13: CreatePermissionDto = {
      permissionName: '批量删除用户',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.batchDelete',
    };
    const permission14: CreatePermissionDto = {
      permissionName: '修改用户',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.update',
    };
    const permission15: CreatePermissionDto = {
      permissionName: '查询单个用户',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.queryOne',
    };
    const permission16: CreatePermissionDto = {
      permissionName: '查询所有用户',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.queryAll',
    };
    const permission17: CreatePermissionDto = {
      permissionName: '重置用户搜索',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.resetQueryOne',
    };

    const permission18: CreatePermissionDto = {
      permissionName: '获取用户角色',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.getAssignRole',
    };
    const permission19: CreatePermissionDto = {
      permissionName: '分配用户角色',
      pid: 6,
      route: '',
      type: 3,
      permissionCode: 'btn.User.assignRole',
    };
    const permission20: CreatePermissionDto = {
      permissionName: '新增角色',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.add',
    };
    const permission21: CreatePermissionDto = {
      permissionName: '删除单个角色',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.deleteOne',
    };
    const permission22: CreatePermissionDto = {
      permissionName: '批量删除角色',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.batchDelete',
    };
    const permission23: CreatePermissionDto = {
      permissionName: '修改角色',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.update',
    };
    const permission24: CreatePermissionDto = {
      permissionName: '查询单个角色',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.queryOne',
    };
    const permission25: CreatePermissionDto = {
      permissionName: '查询所有角色',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.queryAll',
    };
    const permission26: CreatePermissionDto = {
      permissionName: '获取角色权限',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.getAssignPermission',
    };
    const permission27: CreatePermissionDto = {
      permissionName: '赋予角色权限',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.assignPermission',
    };
    const permission28: CreatePermissionDto = {
      permissionName: '重置角色搜索',
      pid: 7,
      route: '',
      type: 3,
      permissionCode: 'btn.Role.resetQueryOne',
    };

    const permission29: CreatePermissionDto = {
      permissionName: '新增权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.add',
    };
    const permission30: CreatePermissionDto = {
      permissionName: '删除单个权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.deleteOne',
    };
    const permission31: CreatePermissionDto = {
      permissionName: '批量删除权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.batchDelete',
    };
    const permission32: CreatePermissionDto = {
      permissionName: '修改权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.update',
    };
    const permission33: CreatePermissionDto = {
      permissionName: '查询单个权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.queryOne',
    };
    const permission34: CreatePermissionDto = {
      permissionName: '查询所有权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.queryAll',
    };
    const permission35: CreatePermissionDto = {
      permissionName: '重置权限搜索',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.resetQueryOne',
    };

    const permission36: CreatePermissionDto = {
      permissionName: '新增目录级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.addDirPermission',
    };
    const permission37: CreatePermissionDto = {
      permissionName: '编辑目录级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.updateDirPermission',
    };
    const permission38: CreatePermissionDto = {
      permissionName: '删除目录级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.deleteDirPermission',
    };
    const permission39: CreatePermissionDto = {
      permissionName: '新增菜单级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.addMenuPermission',
    };
    const permission40: CreatePermissionDto = {
      permissionName: '编辑菜单级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.updateMenuPermission',
    };
    const permission41: CreatePermissionDto = {
      permissionName: '删除菜单级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.deleteMenuPermission',
    };
    const permission42: CreatePermissionDto = {
      permissionName: '新增按钮级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.addBtnPermission',
    };
    const permission43: CreatePermissionDto = {
      permissionName: '编辑按钮级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.updateBtnPermission',
    };
    const permission44: CreatePermissionDto = {
      permissionName: '删除按钮级权限',
      pid: 8,
      route: '',
      type: 3,
      permissionCode: 'btn.Permission.deleteBtnPermission',
    };
    await this.permissionsRepository.save(permission0);
    await this.permissionsRepository.save(permission1);
    await this.permissionsRepository.save(permission2);
    await this.permissionsRepository.save(permission3);
    await this.permissionsRepository.save(permission4);
    await this.permissionsRepository.save(permission5);
    await this.permissionsRepository.save(permission6);
    await this.permissionsRepository.save(permission7);
    await this.permissionsRepository.save(permission8);
    await this.permissionsRepository.save(permission9);
    await this.permissionsRepository.save(permission10);

    await this.permissionsRepository.save(permission11);
    await this.permissionsRepository.save(permission12);
    await this.permissionsRepository.save(permission13);
    await this.permissionsRepository.save(permission14);
    await this.permissionsRepository.save(permission15);
    await this.permissionsRepository.save(permission16);

    await this.permissionsRepository.save(permission17);
    await this.permissionsRepository.save(permission18);
    await this.permissionsRepository.save(permission19);
    await this.permissionsRepository.save(permission20);
    await this.permissionsRepository.save(permission21);
    await this.permissionsRepository.save(permission22);

    await this.permissionsRepository.save(permission23);
    await this.permissionsRepository.save(permission24);
    await this.permissionsRepository.save(permission25);
    await this.permissionsRepository.save(permission26);
    await this.permissionsRepository.save(permission27);
    await this.permissionsRepository.save(permission28);
    await this.permissionsRepository.save(permission29);
    await this.permissionsRepository.save(permission30);
    await this.permissionsRepository.save(permission31);
    await this.permissionsRepository.save(permission32);
    await this.permissionsRepository.save(permission33);
    await this.permissionsRepository.save(permission34);
    await this.permissionsRepository.save(permission35);
    await this.permissionsRepository.save(permission36);
    await this.permissionsRepository.save(permission37);
    await this.permissionsRepository.save(permission38);
    await this.permissionsRepository.save(permission39);
    await this.permissionsRepository.save(permission40);
    await this.permissionsRepository.save(permission41);
    await this.permissionsRepository.save(permission42);
    await this.permissionsRepository.save(permission43);
    await this.permissionsRepository.save(permission44);

    // 分配角色
    const userIdDto1: UserIdDto = { id: 1 };
    const userIdDto2: UserIdDto = { id: 2 };
    const ur1: AssignRoleDto = {
      ids: [1, 2],
    };
    const ur2: AssignRoleDto = {
      ids: [2],
    };
    const userRoles1 = ur1.ids.map((roleId) => ({
      userId: userIdDto1.id,
      roleId: roleId,
    }));
    const userRoles2 = ur2.ids.map((roleId) => ({
      userId: userIdDto2.id,
      roleId: roleId,
    }));
    await this.userRoleRepository.insert(userRoles1);
    await this.userRoleRepository.insert(userRoles2);

    // 分配权限
    const assignPermissionIdDto1: RoleIdDto = { id: 1 };
    const assignPermissionIdDto2: RoleIdDto = { id: 2 };
    const assignPermissionDt1: AssignPermissionDto = {
      ids: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44,
      ],
    };
    // 不存某个角色有父级权限但其子权限全没选的情况
    // 比如有所有权限，系统管理，系统监控，系统服务，系统工具权限，但没有其子权限是不可能的
    // 这种情况下就相当于你什么权限都没有，
    // 也就是说，这种情况只有你通过代码才能实现，前端用户是不可能做出这种操作的
    const assignPermissionDt2: AssignPermissionDto = {
      ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 25, 33],
    };
    const rolePermission1 = assignPermissionDt1.ids.map((permissionId) => ({
      roleId: assignPermissionIdDto1.id,
      permissionId: permissionId,
    }));
    const rolePermission2 = assignPermissionDt2.ids.map((permissionId) => ({
      roleId: assignPermissionIdDto2.id,
      permissionId: permissionId,
    }));
    await this.rolePermissionRepository.insert([
      ...rolePermission1,
      ...rolePermission2,
    ]);
    // setTimeout(async () => {
    //   await this.rolePermissionRepository.insert(rolePermission2);
    // }, 1000);
    return { code: ResultCode.INIT_DATABASE_SUCCESS };
  }

  // 清理数据库
  async clear() {
    // 先清除关联表中的数据
    await this.rolePermissionRepository.delete({});
    await this.userRoleRepository.delete({});

    // 然后清除主表中的数据
    await this.permissionsRepository.delete({});
    await this.rolesRepository.delete({});
    await this.usersRepository.delete({});

    // 清空redis数据库
    await this.redisClient.flushdb(); // 清空当前数据库中的所有键

    // 返回结果
    return { code: ResultCode.CLEAR_DATABASE_SUCCESS };
  }

  async _setAutoIncrementToZero(tableName: string) {
    // 执行SQL语句，设置自增长字段从0开始
    await this.dataSource.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 0;`);
  }
}
