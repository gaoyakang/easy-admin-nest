import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名' })
  username: string;

  @Exclude() // 过滤password
  @Column({ comment: '密码', select: false })
  password: string;

  @Column({ comment: '昵称' })
  nickname?: string;

  @Column({ comment: '手机号' })
  phone?: string;

  @Column({ comment: '头像' })
  avatar?: string;

  @Column({ comment: '邮箱' })
  email?: string;

  // 定义与 Role 的多对多关系
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
