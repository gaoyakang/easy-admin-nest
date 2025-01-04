import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../acl/user/entities/user.entity';
import { RedisModule } from '../../core/db/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
