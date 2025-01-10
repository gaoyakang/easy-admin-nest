import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/business/acl/permission/entities/permission.entity';
import { Role } from 'src/business/acl/role/entities/role.entity';
import { User } from 'src/business/acl/user/entities/user.entity';
import { Repository } from 'typeorm';

// 问题：a用户有token但没有接口权限，不加限制的话，a就可以访问所有接口
// 功能：判断用户是否拥有访问接口的权限
// 分类：
// 1.什么也不需要就可以访问：login接口，通过AuthCheckGuard校验
// 2.有token就可以访问：logout接口，info接口，通过AuthCheckGuard校验
// 3.有x权限才可以访问：其余接口，通过PermissionCheckGuard校验
// 思路：
// 1.在接口上添加meta信息，用户每次访问该接口时，会先把自身的权限和meta信息对比，通过则继续返回数据，否则返回403❌
// 2.通过路径指定请求意图，再与用户自身权限比较判断是否有权限访问接口✅

@Injectable()
export class PermissionCheckGuard implements CanActivate {
  private whiteList = ['/auth/login', '/auth/logout', '/auth/info']; // 白名单数组
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private reflector: Reflector, // 注入 Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const path = request.path; // 获取当前请求的路径

    // 检查当前请求的路径是否在白名单中
    if (this.whiteList.includes(path)) {
      return true; // 白名单中的接口不需要权限校验
    }
    // 获取当前请求的权限要求
    const requiredPermissions = this.getRequiredPermissions(context);
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // 如果没有权限要求，则允许访问
    }

    // 获取用户的角色
    const userRoles = await this.userRepository.findOne({
      where: { id: user.uid },
      relations: ['roles'],
    });

    // 获取角色的权限
    const userPermissions = await this.getPermissionsFromRoles(userRoles.roles);

    // 检查用户是否具有所有必需的权限
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  private getRequiredPermissions(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    return this.reflector.get<string[]>('requiredPermissions', handler) || [];
  }

  private async getPermissionsFromRoles(roles: Role[]): Promise<string[]> {
    const permissions = await Promise.all(
      roles.map((role) =>
        this.roleRepository.findOne({
          where: { id: role.id },
          relations: ['permissions'],
        }),
      ),
    );

    return permissions.flatMap((role) =>
      role.permissions.map((permission) => permission.permissionCode),
    );
  }
}
