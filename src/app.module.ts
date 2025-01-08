import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './business/acl/user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './core/config/configuration';
import { MysqlModule } from './core/db/mysql.module';
import { WinstonCustomModule } from './core/log/winstonCustom';
import { JwtAuthModule } from './core/db/jwt.module';
import { RedisModule } from './core/db/redis.module';
import { AuthModule } from './business/auth/auth.module';
import { RequestLoggerMiddleware } from './core/middleware/requestLogger.middleware';
import { AuthCheckGuard } from './core/guard/authCheck.guard';
import { RoleModule } from './business/acl/role/role.module';
import { PermissionModule } from './business/acl/permission/permission.module';
import { PermissionCheckGuard } from './core/guard/permissionCheck.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './business/acl/user/entities/user.entity';
import { Role } from './business/acl/role/entities/role.entity';
import { Permission } from './business/acl/permission/entities/permission.entity';
import { UserRole } from './business/acl/user/entities/user-role.entity';
import { RolePermission } from './business/acl/role/entities/role-permission.entity';

@Module({
  imports: [
    // 配置
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    // mysql
    MysqlModule.forRootAsync(),
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      RolePermission,
    ]), //为了PermissionCheckGuard使用

    // jwt
    JwtAuthModule.forRoot(),
    // redis
    RedisModule.forRoot(),
    // logger
    WinstonCustomModule,
    // 业务模块
    UserModule,
    RoleModule,
    PermissionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthCheckGuard, PermissionCheckGuard],
  exports: [PermissionCheckGuard],
})
export class AppModule {
  // 配合winston截取请求日志的中间件
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
