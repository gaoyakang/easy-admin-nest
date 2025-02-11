import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

/**
 * type: 1目录 2菜单 3按钮
 * -----------------------------------------------------------------------------------------------------------
 *       id        pid            pname             pcode                route               type
 * -----------------------------------------------------------------------------------------------------------
 *        1         0             首页                                     /                    1
 *        2         0             系统管理                                  /system              1
 *        3         0             系统监控                                  /monitor             1
 *        4         0             系统服务                                  /service             1
 *        5         0             系统工具                                  /tool                1
 * ------------------------------------------------------------------------------------------------------------
 *        6         1             用户管理           User                   /manage/user         2
 *        7         1             角色管理           Role                   /manage/role         2
 *        8         1             权限管理           Permission             /manage/permission   2
 *        9         1             新增用户           btn.User.add                                3
 *        10        6             删除用户           btn.User.delete                             3
 *        11        6             修改用户           btn.User.update                             3
 *        12        6             查询用户           btn.User.query                              3
 *        13        6             查询用户           btn.User.add                                3
 * */

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '权限名' })
  permissionName: string;

  @Column({ comment: '父级id' })
  pid: number;

  @Column({ comment: '权限码' })
  permissionCode: string; // Acl, btn.User.add

  @Column({ comment: '权限类型' })
  type: number; // 1是目录，2是菜单，3是按钮

  @Column({ comment: '路由', nullable: true })
  route: string; // 1是菜单，2是按钮

  // 与role的多对多关联
  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({ name: 'role_permission' })
  roles: Role[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  // 方便生成tree结构
  // 添加 children 属性
  children: Permission[];

  // 方便前端知晓用户是否拥有当前权限
  select: boolean;
}
