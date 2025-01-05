import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonCustom } from '../log/winstonCustom';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  @Inject('WinstonCustom')
  private readonly winstonCustom: WinstonCustom;

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const ip = req.ip;
    const method = req.method;
    const url = req.originalUrl;

    // 所有路由只要请求了就会进这里
    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;
      const message = `${ip} - ${method} ${url} - ${statusCode} - ${duration}ms`;
      const logger = this.winstonCustom.genLogger('RequestLoggerMiddleware');

      if (Number(statusCode) < 500) {
        logger.log(message);
      } else {
        logger.error(message);
      }
    });

    next();
  }
}
