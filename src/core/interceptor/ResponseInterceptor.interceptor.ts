import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResultMessages } from 'src/core/common/constant';
import { R } from 'src/core/common/ResultData';

// 包装200请求返回的结果
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        const { code, data } = result;
        // 通过code奇偶性判断使用ok还是error
        if (code % 2 === 0) {
          // 使用 R 类型包装数据
          return R.ok()
            .setCode(code)
            .setMessage(ResultMessages[code])
            .setData(data ? data : []);
        } else {
          // 使用 R 类型包装数据
          return R.error()
            .setCode(code)
            .setMessage(ResultMessages[code])
            .setData(data ? data : []);
        }
      }),
    );
  }
}
