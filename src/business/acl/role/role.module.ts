import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ConfigModule } from '@nestjs/config';
import { WinstonCustomModule } from 'src/core/log/winstonCustom';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from '../permission/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission, Permission]),
    ConfigModule.forRoot(),
    WinstonCustomModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
