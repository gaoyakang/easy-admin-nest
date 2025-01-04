import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ResultCode } from 'src/core/common/constant';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 新增用户
  async create(createUserDto: CreateUserDto) {
    // 判断用户是否存在
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: createUserDto.username })
      .getOne();
    if (user) {
      return { code: ResultCode.USER_ALREADY_EXIST };
    } else {
      // 密码加密
      const saltOrRounds = this.configService.get('app.saltOrRounds'); // 生成盐的复杂度
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );
      createUserDto.password = hashedPassword;
      // 保存用户
      await this.usersRepository.save(createUserDto);
      // 定义操作码和对应的提示信息，每次返回data和操作吗，自动帮我包装返回数据
      return {
        code: ResultCode.USER_CREATED_SUCCESS,
      };
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
