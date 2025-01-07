import { Module, DynamicModule, Global } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/business/acl/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Role } from 'src/business/acl/role/entities/role.entity';
import { Permission } from 'src/business/acl/permission/entities/permission.entity';
import { UserRole } from 'src/business/acl/user/entities/user-role.entity';
import { RolePermission } from 'src/business/acl/role/entities/role-permission.entity';

@Global()
@Module({})
export class MysqlModule {
  static async forRootAsync(): Promise<DynamicModule> {
    return {
      module: MysqlModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const options: TypeOrmModuleOptions = {
              type: 'mysql',
              host: configService.get('db.mysql.host'),
              port: configService.get('db.mysql.port'),
              username: configService.get('db.mysql.username'),
              password: configService.get('db.mysql.password'),
              database: configService.get('db.mysql.database'),
              entities: [User, Role, Permission, UserRole, RolePermission],
              synchronize: true,
            };
            const dataSource = new DataSource({
              type: 'mysql',
              username: configService.get('db.mysql.username'),
              password: configService.get('db.mysql.password'),
              database: configService.get('db.mysql.database'),
            });
            // 尝试初始化连接
            let isConnected = false;
            while (!isConnected) {
              try {
                await dataSource.initialize();
                isConnected = true;
                return options;
              } catch (error) {
                error.name = 'MysqlModule';
                process.emit('uncaughtException', error);
                // 每隔30s尝试重新链接
                await new Promise((resolve) => setTimeout(resolve, 15000));
              }
            }
          },
        }),
      ],
    };
  }
}
