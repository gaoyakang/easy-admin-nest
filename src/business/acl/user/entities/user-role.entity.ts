import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserRole {
  @PrimaryColumn({ comment: '用户id' })
  userId: number;

  @PrimaryColumn({ comment: '角色id' })
  roleId: number;
}
