import { ResultCode, ResultMessages } from './constant';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class R {
  private code: number;
  private success: boolean;
  private message: string;
  private data: object;

  // 禁止外部new
  private R() {}

  // 请求成功的方法
  public static ok(): R {
    const r = new R();
    r.code = ResultCode.SUCCESS;
    r.success = true;
    r.message = ResultMessages[ResultCode.SUCCESS];
    return r;
  }

  // 请求失败的方法
  public static error(): R {
    const r = new R();
    r.code = ResultCode.ERROR;
    r.success = false;
    r.message = ResultMessages[ResultCode.ERROR];
    return r;
  }

  // 链式添加信息
  public setCode(code: number): R {
    this.code = code;
    return this;
  }

  public setSuccess(success: boolean): R {
    this.success = success;
    return this;
  }

  public setMessage(message: string): R {
    this.message = message;
    return this;
  }

  public setData(data: object): R {
    this.data = data;
    return this;
  }
}
