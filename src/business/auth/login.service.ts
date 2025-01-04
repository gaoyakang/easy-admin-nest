import { Inject, Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { ResultCode } from 'src/core/common/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../acl/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
  ) {}

  // 登陆
  async login(createLoginDto: CreateLoginDto) {
    // 判断用户是否存在
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.password']) // 显式选择需要的字段
      .where('user.username = :username', { username: createLoginDto.username })
      .getOne();
    if (!user) {
      return { code: ResultCode.USER_NOT_FOUND };
    }
    // 用户存在，校验密码
    const isPasswordValid = await bcrypt.compare(
      createLoginDto.password,
      user.password,
    );

    // 密码错误
    if (!isPasswordValid) {
      return { code: ResultCode.USER_PASSWORD_FAILED };
    }

    // 密码正确，返回token
    const payload = { uid: user.id };
    const token = this.jwtService.sign(payload);

    // token存入redis
    const EX = this.configService.get('redis.EX');
    await this.redisClient.set(`token:${user.id}`, token, 'EX', EX);

    return {
      code: ResultCode.USER_LOGIN_SUCCESS,
      data: { token },
    };
  }

  // 登出
  // async logout(){

  // }
}
