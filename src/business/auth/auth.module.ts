import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../acl/user/entities/user.entity';
import { RedisModule } from '../../core/db/redis.module';
import { WinstonCustomModule } from 'src/core/log/winstonCustom';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, WinstonCustomModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
