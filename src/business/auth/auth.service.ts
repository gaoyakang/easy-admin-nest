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
import { WinstonCustom } from 'src/core/log/winstonCustom';

@Injectable()
export class AuthService {
  logger: any;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
    @Inject('WinstonCustom') private winstonCustom: WinstonCustom,
  ) {
    this.logger = winstonCustom.genLogger('LoginService');
  }

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
    try {
      const EX = this.configService.get('redis.EX');
      await this.redisClient.set(`token:${user.id}`, token, 'EX', EX);
      return {
        code: ResultCode.USER_LOGIN_SUCCESS,
        data: { token },
      };
    } catch (e) {
      this.logger.error('redisClient.set ' + e);
      return {
        code: ResultCode.USER_LOGIN_FAILED,
      };
    }
  }

  // 登出
  async logout(user) {
    try {
      // 直接从 Redis 中删除 token
      await this.redisClient.del(`token:${user.uid}`);
      return { code: ResultCode.USER_LOGOUT_SUCCESS };
    } catch (e) {
      this.logger.error('logout.redisClient.del' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }
}
