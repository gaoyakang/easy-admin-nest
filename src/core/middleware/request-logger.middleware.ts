import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonCustom } from '../log/winstonCustom';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  @Inject()
  private winstonCustom: WinstonCustom;

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const ip = req.ip;
    const method = req.method;
    const url = req.originalUrl;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;
      const message = `${ip} - ${method} ${url} - ${statusCode} - ${duration}ms`;

      const logger = this.winstonCustom.genLogger();
      logger.log(message, { label: 'MiddlewareLogger' });
    });

    next();
  }
}
