import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RolePermission {
  @PrimaryColumn({ comment: '权限id' })
  permissionId: number;

  @PrimaryColumn({ comment: '角色id' })
  roleId: number;
}
