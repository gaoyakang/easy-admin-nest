import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { WinstonCustomModule } from 'src/core/log/winstonCustom';
import { UserRole } from './entities/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole]),
    ConfigModule.forRoot(),
    WinstonCustomModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
