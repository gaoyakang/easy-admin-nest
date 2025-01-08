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

// 接口异常拦截器
@Catch()
export class ExceptionResult implements ExceptionFilter {
  logger: any;
  constructor(@Inject('WinstonCustom') private winstonCustom: WinstonCustom) {
    this.logger = winstonCustom.genLogger('ExceptionResult');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let code: number;

    if (exception instanceof HttpException) {
      status = code = exception.getStatus();
      message = exception.message;
      if (status === 403) {
        code = ResultCode.NO_INTERFACE_PERMISSION;
        message = ResultMessages[ResultCode.NO_INTERFACE_PERMISSION];
      }
    } else {
      // 对于非 HttpException 的异常，尝试从异常对象中提取信息
      status = 500;
      code = ResultCode.SERVER_EXCEPTION;
      message = this.extractErrorMessage(exception);
      this.logger.error(message);
    }

    // 使用 R 包装异常数据为统一格式
    response
      .status(status)
      .json(R.error().setCode(code).setMessage(message).setData([]));
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
