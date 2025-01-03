import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ResultCode } from 'src/common/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(createUserDto: CreateUserDto) {
    // throw new ForbiddenException('后台异常');
    const data = await this.usersRepository.save(createUserDto);
    // 定义操作码和对应的提示信息，每次返回data和操作吗，自动帮我包装返回数据
    return { code: ResultCode.USER_CREATED_SUCCESS, data };
  }

  findAll() {
    return `This action returns all user`;
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
