import { Injectable } from '@nestjs/common';
import { ResultCode } from './core/common/constant';

@Injectable()
export class AppService {
  getHello() {
    return { code: ResultCode.USER_WELCOME };
  }
}
