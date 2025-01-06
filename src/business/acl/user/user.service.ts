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
import { PaginationDto } from './dto/pagination.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { SearchConditionDto } from './dto/search-condition.dto';

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
  async findAll(
    paginationDto: PaginationDto,
    searchConditionDto: SearchConditionDto,
  ) {
    try {
      const { page, limit } = paginationDto;
      const skip = (page - 1) * limit;
      const queryBuilder = this.usersRepository.createQueryBuilder('user');
      if (searchConditionDto.keyword) {
        queryBuilder.where('user.username LIKE :keyword', {
          keyword: `%${searchConditionDto.keyword}%`,
        });
      }
      const users = await queryBuilder.skip(skip).take(limit).getMany();

      const total = await queryBuilder.getCount();
      return {
        code: ResultCode.USER_FINDALL_SUCCESS,
        data: {
          total,
          users,
        },
      };
    } catch (e) {
      this.logger.error(
        'queryBuilder.skip(skip).take(limit).getMany() ' + e.message,
      );
      return { code: ResultCode.USER_FINDALL_FAILED };
    }
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

  // 根据id查询单个用户
  async findOne(searchUserDto: SearchUserDto) {
    try {
      const data = await this.usersRepository.findOne({
        where: { id: searchUserDto.id },
      });
      return { code: ResultCode.USER_FINDONE_SUCCESS, data: [data] };
    } catch (e) {
      this.logger.error('usersRepository.findOne' + e.message);
      return { code: ResultCode.SERVER_EXCEPTION };
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
