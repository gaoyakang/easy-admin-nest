import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { WinstonCustomModule } from 'src/core/log/winstonCustom';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(),
    WinstonCustomModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
