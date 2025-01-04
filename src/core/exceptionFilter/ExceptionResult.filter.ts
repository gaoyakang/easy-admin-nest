import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { R } from 'src/core/common/ResultData';
import { ResultCode, ResultMessages } from '../common/constant';
import { WinstonCustom } from '../log/winstonCustom';

@Catch()
// 接口异常拦截器
export class ExceptionResult implements ExceptionFilter {
  constructor(@Inject(WinstonCustom) private winstonCustom: WinstonCustom) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else {
      const logger = this.winstonCustom.genLogger();
      // 对于非 HttpException 的异常，尝试从异常对象中提取信息
      status = ResultCode.SERVER_EXCEPTION;
      message = this.extractErrorMessage(exception);
      logger.log(message, { label: 'exceptionLogger' });
    }

    // 使用 R 包装异常数据为统一格式
    response
      .status(status)
      .json(R.error().setCode(status).setMessage(message).setData([]));
  }

  private extractErrorMessage(exception: any): string {
    if (exception.message) {
      return exception.message;
    } else if (exception instanceof Error) {
      return exception.name + ': ' + exception.message;
    } else {
      // 无法从异常对象中提取信息则返回默认信息
      return ResultMessages[ResultCode.SERVER_EXCEPTION];
    }
  }
}
