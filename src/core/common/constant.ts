// 返回结果码：用户级别
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
  USER_LOGOUT_SUCCESS = 20012,
  USER_LOGOUT_FAILED = 20013,
  USER_WELCOME = 20014,

  USER_NOT_FOUND = 20215,
  USER_PASSWORD_FAILED = 20217,
  USER_ALREADY_EXIST = 20219,
  UNAUTHORIZED_TOKEN = 20221,
  PARAM_FORMAT_ERROR = 20223,
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
  [ResultCode.USER_LOGOUT_SUCCESS]: '退出登陆成功',
  [ResultCode.USER_LOGOUT_FAILED]: '退出登陆失败',
  [ResultCode.UNAUTHORIZED_TOKEN]: 'token不存在/失效',
  [ResultCode.USER_WELCOME]: '欢迎访问EasyAdmin接口',
  [ResultCode.PARAM_FORMAT_ERROR]: '请求参数格式错误',
};

// 应用错误码：开发者级别
export enum AppErrorCode {
  BCRYPT_HASH_FAILED = 30001,
  USER_SAVE_FAILED = 30003,
  USERS_REPOSITORY_SEARCH_FAILED = 30005,
}
export const AppErrorMessages = {
  [AppErrorCode.BCRYPT_HASH_FAILED]: 'bcrypt.hash失败',
  [AppErrorCode.USER_SAVE_FAILED]: 'usersRepository.save失败',
  [AppErrorCode.USERS_REPOSITORY_SEARCH_FAILED]: 'usersRepository.search失败',
};
