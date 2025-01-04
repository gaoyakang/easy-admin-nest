// redis.module.ts
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
            const redisConfig = {
              host: configService.get('redis.host'),
              port: configService.get('redis.port'),
              password: configService.get('redis.password'),
            };

            return new Redis(redisConfig);
          },
          inject: [ConfigService],
        },
      ],
      exports: ['REDIS_CLIENT'], // 确保这里导出了 REDIS_CLIENT
    };
  }
}
