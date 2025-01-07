import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WinstonCustomModule } from 'src/core/log/winstonCustom';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    ConfigModule.forRoot(),
    WinstonCustomModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
