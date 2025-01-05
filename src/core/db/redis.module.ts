import { Module, DynamicModule, Global } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({})
export class RedisModule {
  static async forRoot(): Promise<DynamicModule> {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async (configService: ConfigService) => {
            // 确保redis服务失效时，应用能感知
            const redisConfig = {
              host: configService.get('redis.host'),
              port: configService.get('redis.port'),
              password: configService.get('redis.password'),
            };

            const client = new Redis(redisConfig);

            // 监听连接错误事件
            client.on('error', (error) => {
              // 发送事件并传递错误信息
              error.name = 'RedisModule';
              process.emit('uncaughtException', error);
            });
            return client;
          },
          inject: [ConfigService],
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }
}
