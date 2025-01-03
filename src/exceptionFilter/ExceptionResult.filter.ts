import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { R } from 'src/common/ResultData';

@Catch()
// 接口异常拦截器
export class ExceptionResult implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    // 使用R包装异常数据为统一格式
    response
      .status(status)
      .json(
        R.error().setCode(status).setMessage(exception.message).setData([]),
      );
  }
}
