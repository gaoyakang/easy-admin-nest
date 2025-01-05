import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'; // 导入 Express 的 Request 类型
import Redis from 'ioredis';

@Injectable()
export class AuthCheckGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查路由是否被标记为 public
    const isPublic = this.reflector.get<boolean>(
      'is-public',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    // 检查token
    const request = context.switchToHttp().getRequest<Request>(); // 使用类型断言
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('请携带token访问');
    }

    try {
      // 检查jwt是否合法
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;

      // 检查 Redis 中是否存在该 token
      const tokenInRedis = await this.redisClient.get(`token:${payload.uid}`);

      if (!tokenInRedis || tokenInRedis !== token) {
        throw new UnauthorizedException('token无效或已过期');
      }
      return true;
    } catch {
      throw new UnauthorizedException('token无效或已过期');
    }
  }

  // 提取token工具方法
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
