import { Module, DynamicModule, Global } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({})
export class JwtAuthModule {
  static forRoot(): DynamicModule {
    return {
      module: JwtAuthModule,
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              secret: configService.get<string>('jwt.secret'),
              signOptions: {
                expiresIn: configService.get<string>('jwt.expiresIn'),
              },
            } as JwtModuleOptions;
          },
        }),
      ],
      exports: [JwtModule], // 确保 JwtModule 可以被其他模块使用
    };
  }
}
