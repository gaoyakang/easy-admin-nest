import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ConfigModule } from '@nestjs/config';
import { WinstonCustomModule } from 'src/core/log/winstonCustom';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    ConfigModule.forRoot(),
    WinstonCustomModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
