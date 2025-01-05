import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  AppErrorCode,
  AppErrorMessages,
  ResultCode,
} from 'src/core/common/constant';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { WinstonCustom } from 'src/core/log/winstonCustom';

@Injectable()
export class UserService {
  logger: any;
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject('WinstonCustom') private winstonCustom: WinstonCustom,
  ) {
    this.logger = winstonCustom.genLogger('UserService');
  }

  // 新增用户
  async create(createUserDto: CreateUserDto) {
    // 判断用户是否存在
    const exist = await this._userExist(createUserDto);
    if (exist) {
      return { code: ResultCode.USER_ALREADY_EXIST };
    } else {
      // 密码加密
      createUserDto = await this._hashedPasswordFunc(createUserDto);
      // 数据入库
      return await this._saveUser(createUserDto);
    }
  }

  // 获取所有用户
  async findAll() {
    const users = await this.usersRepository.find();
    return {
      code: ResultCode.USER_FINDALL_SUCCESS,
      data: {
        total: users.length,
        users,
      },
    };
  }

  // 密码加密函数抽离
  async _hashedPasswordFunc(createUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        this.configService.get('app.saltOrRounds'),
      );
      createUserDto.password = hashedPassword;

      return createUserDto;
    } catch (e) {
      this.logger.error(AppErrorMessages[AppErrorCode.BCRYPT_HASH_FAILED] + e);
      return {
        code: ResultCode.USER_CREATED_FAILED,
      };
    }
  }

  // 用户入库函数抽离
  async _saveUser(createUserDto) {
    try {
      // 保存用户
      await this.usersRepository.save(createUserDto);
      // 定义操作码和对应的提示信息，每次返回data和操作吗，自动帮我包装返回数据
      return {
        code: ResultCode.USER_CREATED_SUCCESS,
      };
    } catch (e) {
      this.logger.error(AppErrorMessages[AppErrorCode.USER_SAVE_FAILED] + e);
      return {
        code: ResultCode.USER_CREATED_FAILED,
      };
    }
  }

  // 判断用户是否已存在函数抽离
  async _userExist(createUserDto) {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.username = :username', {
          username: createUserDto.username,
        })
        .getOne();
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      this.logger.error(
        AppErrorMessages[AppErrorCode.USERS_REPOSITORY_SEARCH_FAILED] + e,
      );
      return { code: ResultCode.USER_CREATED_FAILED };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
