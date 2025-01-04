export enum ResultCode {
  // 偶数成功，奇数失败
  SUCCESS = 20000,
  ERROR = 20001,
  SERVER_EXCEPTION = 50000,

  USER_CREATED_SUCCESS = 20002,
  USER_CREATED_FAILED = 20003,
  USER_UPDATED_SUCCESS = 20004,
  USER_UPDATED_FAILED = 20005,
  USER_DELETED_SUCCESS = 20006,
  USER_DELETED_FAILED = 20007,
  USER_FINDALL_SUCCESS = 20008,
  USER_FINDALL_FAILED = 20009,
  USER_LOGIN_SUCCESS = 20010,
  USER_LOGIN_FAILED = 20011,

  USER_NOT_FOUND = 20013,
  USER_PASSWORD_FAILED = 20015,
  USER_ALREADY_EXIST = 20017,
}

export const ResultMessages = {
  [ResultCode.SUCCESS]: '操作成功',
  [ResultCode.ERROR]: '操作失败',
  [ResultCode.USER_CREATED_SUCCESS]: '用户创建成功',
  [ResultCode.USER_UPDATED_SUCCESS]: '用户更新成功',
  [ResultCode.USER_DELETED_SUCCESS]: '用户删除成功',
  [ResultCode.USER_CREATED_FAILED]: '用户创建失败',
  [ResultCode.USER_UPDATED_FAILED]: '用户更新失败',
  [ResultCode.USER_DELETED_FAILED]: '用户删除失败',
  [ResultCode.USER_FINDALL_SUCCESS]: '查询所有用户成功',
  [ResultCode.USER_FINDALL_FAILED]: '查询所有用户失败',
  [ResultCode.SERVER_EXCEPTION]: '系统异常',
  [ResultCode.USER_LOGIN_SUCCESS]: '登陆成功',
  [ResultCode.USER_LOGIN_FAILED]: '登陆失败',
  [ResultCode.USER_NOT_FOUND]: '用户不存在',
  [ResultCode.USER_PASSWORD_FAILED]: '用户密码错误',
  [ResultCode.USER_ALREADY_EXIST]: '用户已存在',
};
