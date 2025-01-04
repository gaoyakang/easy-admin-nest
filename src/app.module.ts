// app.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './business/acl/user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './core/config/configuration';
import { MysqlModule } from './core/db/mysql.module';
import { WinstonCustom } from './core/log/winstonCustom';
import { RequestLoggerMiddleware } from './core/middleware/request-logger.middleware';
import { LoginModule } from './business/auth/login.module';
import { JwtAuthModule } from './core/db/jwt.module';
import { RedisModule } from './core/db/redis.module';

@Module({
  imports: [
    // 配置
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    // mysql
    MysqlModule.forRoot(),
    // jwt
    JwtAuthModule.forRoot(),
    // redis
    RedisModule.forRoot(),
    // 业务模块
    UserModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService, WinstonCustom],
  exports: [WinstonCustom],
})
export class AppModule {
  // 配合winston截取请求日志
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
