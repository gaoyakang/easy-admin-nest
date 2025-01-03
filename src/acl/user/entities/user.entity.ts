import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名' })
  username: string;

  @Column({ comment: '昵称' })
  nickname?: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '头像' })
  avatar?: string;

  @Column({ comment: '邮箱' })
  email?: string;

  @Column({ comment: '手机号' })
  phone?: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
