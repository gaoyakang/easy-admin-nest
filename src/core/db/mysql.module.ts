import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/business/acl/user/entities/user.entity';

@Module({})
export class MysqlModule {
  static async forRoot(): Promise<DynamicModule> {
    return {
      module: MysqlModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              type: 'mysql',
              host: configService.get('db.mysql.host'),
              port: configService.get('db.mysql.port'),
              username: configService.get('db.mysql.username'),
              password: configService.get('db.mysql.password'),
              database: configService.get('db.mysql.database'),
              entities: [User],
              synchronize: true,
            } as TypeOrmModuleOptions;
          },
        }),
      ],
    };
  }
}
