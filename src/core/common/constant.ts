// 返回结果码：用户级别
export enum ResultCode {
  /**
   *
   *
   * 偶数成功，奇数失败，在没有完成之前，无法整理
   * 1.用户码：
        20000 - 20299 预留299个数字用作用户特殊信息码
        20300 - 20999 预留699个数字用作用户普通信息码
   * 2.应用码：
        30000 - 用作应用错误码
   * 3.特殊码：
        50000-系统错误
        400001-token不存在/失效
   */

  SUCCESS = 20000, // 通用操作成功
  ERROR = 20001, // 通用操作失败
  USER_WELCOME = 20002, // 欢迎
  INIT_DATABASE_FAILED = 20003, // 初始化数据库失败
  INIT_DATABASE_SUCCESS = 20004, // 初始化数据库成功
  CLEAR_DATABASE_FAILED = 2005, // 清理数据库失败
  CLEAR_DATABASE_SUCCESS = 2006, // 清理数据库失败
  UNAUTHORIZED_TOKEN = 40001, // token不存在/失效
  NO_INTERFACE_PERMISSION = 40003, // 缺少接口权限
  SERVER_EXCEPTION = 50000, //系统错误

  USER_CREATED_SUCCESS = 20300, // 创建用户成功
  USER_CREATED_FAILED = 20301, // 创建用户失败
  USER_UPDATED_SUCCESS = 20302, // 更新用户成功
  USER_UPDATED_FAILED = 20303, // 更新用户失败
  USER_DELETED_SUCCESS = 20304, // 删除用户成功
  USER_DELETED_FAILED = 20305, // 删除用户失败
  USER_FINDALL_SUCCESS = 20306, // 查询所有用户成功
  USER_FINDALL_FAILED = 20307, // 查询所有用户失败
  USER_LOGIN_SUCCESS = 20308, //用户登陆成功
  USER_LOGIN_FAILED = 20309, //用户登陆失败
  USER_LOGOUT_SUCCESS = 20310, //用户登出成功
  USER_LOGOUT_FAILED = 20311, //用户登出失败
  USER_FINDONE_SUCCESS = 20312, // 查询单个用户成功
  USER_FINDONE_FAILED = 20313, // 查询单个用户失败
  USER_BATCH_DELETE_SUCCESS = 20314, // 批量删除用户成功
  USER_BATCH_DELETE_FAILED = 20315, // 批量删除用户失败
  USER_NOT_FOUND = 20215,
  USER_PASSWORD_FAILED = 20217,
  USER_ALREADY_EXIST = 20219,
  USERNAME_ALREADY_EXISTS = 20225,
  USER_INFO_SUCCESS = 20226,
  USER_INFO_FAILED = 20227,

  ROLE_CREATED_SUCCESS = 20316, // 创建角色成功
  ROLE_CREATED_FAILED = 20317, // 创建角色失败
  ROLE_UPDATED_SUCCESS = 20318, // 更新角色成功
  ROLE_UPDATED_FAILED = 20319, // 更新角色失败
  ROLE_DELETED_SUCCESS = 20320, // 删除角色成功
  ROLE_DELETED_FAILED = 20321, // 删除角色失败
  ROLE_FINDALL_SUCCESS = 20322, // 查询所有角色成功
  ROLE_FINDALL_FAILED = 20323, // 查询所有角色失败
  ROLE_FINDONE_SUCCESS = 20324, // 查询单个角色成功
  ROLE_FINDONE_FAILED = 20325, // 查询单个角色失败
  ROLE_BATCH_DELETE_SUCCESS = 20326, // 批量删除角色成功
  ROLE_BATCH_DELETE_FAILED = 20327, // 批量删除角色失败
  ROLENAME_ALREADY_EXISTS = 20247,
  ROLE_NOT_FOUND = 20229,
  ROLE_ALREADY_EXIST = 20231,
  ROLE_SAVE_FAILED = 20233,
  ROLELABEL_ALREADY_EXISTS = 20235,
  ROLENAME_AND_LABEL_ALREADY_EXISTS = 20237,
  USER_GET_ASSIGN_ROLE_SUCCESS = 20240,
  USER_ASSIGN_ROLE_SUCCESS = 20242,
  ROLE_ASSIGN_PERMISSION_SUCCESS = 20244,

  PERMISSION_CREATED_SUCCESS = 20328, // 创建权限成功
  PERMISSION_CREATED_FAILED = 20329, // 创建权限失败
  PERMISSION_UPDATED_SUCCESS = 20330, // 更新权限成功
  PERMISSION_UPDATED_FAILED = 20331, // 更新权限失败
  PERMISSION_DELETED_SUCCESS = 20332, // 删除权限成功
  PERMISSION_DELETED_FAILED = 20333, // 删除权限失败
  PERMISSION_FINDALL_SUCCESS = 20334, // 查询所有权限成功
  PERMISSION_FINDALL_FAILED = 20335, // 查询所有权限失败
  PERMISSION_FINDONE_SUCCESS = 20336, // 查询单个权限成功
  PERMISSION_FINDONE_FAILED = 20337, // 查询单个权限失败
  PERMISSION_BATCH_DELETE_SUCCESS = 20338, // 批量删除权限成功
  PERMISSION_BATCH_DELETE_FAILED = 20339, // 批量删除权限失败
  PERMISSION_ALREADY_EXISTS = 20239,
  PERMISSION_CODE_ALREADY_EXISTS = 20241, //权限码已存在
  ROUTE_ALREADY_EXISTS = 20243, // 权限路由已存在
  PERMISSION_NOT_FOUND = 20245, //权限不存在

  PARAM_FORMAT_ERROR = 20223,
}

export const ResultMessages = {
  [ResultCode.SUCCESS]: '操作成功',
  [ResultCode.ERROR]: '操作失败',
  [ResultCode.USER_WELCOME]: '欢迎访问EasyAdmin接口',
  [ResultCode.INIT_DATABASE_SUCCESS]: '初始化数据库成功',
  [ResultCode.INIT_DATABASE_FAILED]: '初始化数据库失败',
  [ResultCode.CLEAR_DATABASE_SUCCESS]: '清理数据库成功',
  [ResultCode.CLEAR_DATABASE_FAILED]: '清理数据库失败',
  [ResultCode.NO_INTERFACE_PERMISSION]: '无权访问当前接口',
  [ResultCode.UNAUTHORIZED_TOKEN]: 'token不存在/失效',
  [ResultCode.SERVER_EXCEPTION]: '系统异常',

  [ResultCode.USER_CREATED_SUCCESS]: '用户创建成功',
  [ResultCode.USER_UPDATED_SUCCESS]: '用户更新成功',
  [ResultCode.USER_DELETED_SUCCESS]: '用户删除成功',
  [ResultCode.USER_CREATED_FAILED]: '用户创建失败',
  [ResultCode.USER_UPDATED_FAILED]: '用户更新失败',
  [ResultCode.USER_DELETED_FAILED]: '用户删除失败',
  [ResultCode.USER_FINDALL_SUCCESS]: '查询所有用户成功',
  [ResultCode.USER_FINDALL_FAILED]: '查询所有用户失败',
  [ResultCode.USER_BATCH_DELETE_SUCCESS]: '批量删除用户成功',
  [ResultCode.USER_BATCH_DELETE_FAILED]: '批量删除用户失败',
  [ResultCode.USER_LOGIN_SUCCESS]: '登陆成功',
  [ResultCode.USER_LOGIN_FAILED]: '登陆失败',
  [ResultCode.USER_LOGOUT_SUCCESS]: '退出登陆成功',
  [ResultCode.USER_LOGOUT_FAILED]: '退出登陆失败',

  [ResultCode.USER_NOT_FOUND]: '用户不存在',
  [ResultCode.USER_PASSWORD_FAILED]: '用户密码错误',
  [ResultCode.USER_ALREADY_EXIST]: '用户已存在',
  [ResultCode.PARAM_FORMAT_ERROR]: '请求参数格式错误',
  [ResultCode.USER_FINDONE_SUCCESS]: '查询单个用户成功',
  [ResultCode.USER_FINDONE_FAILED]: '查询单个用户失败',
  [ResultCode.USERNAME_ALREADY_EXISTS]: '当前用户名已被占用',

  [ResultCode.ROLE_CREATED_SUCCESS]: '角色创建成功',
  [ResultCode.ROLE_UPDATED_SUCCESS]: '角色更新成功',
  [ResultCode.ROLE_DELETED_SUCCESS]: '角色删除成功',
  [ResultCode.ROLE_CREATED_FAILED]: '角色创建失败',
  [ResultCode.ROLE_UPDATED_FAILED]: '角色更新失败',
  [ResultCode.ROLE_DELETED_FAILED]: '角色删除失败',
  [ResultCode.ROLE_FINDALL_SUCCESS]: '查询所有角色成功',
  [ResultCode.ROLE_FINDALL_FAILED]: '查询所有角色失败',
  [ResultCode.ROLE_FINDONE_SUCCESS]: '查询单个角色成功',
  [ResultCode.ROLE_FINDONE_FAILED]: '查询单个角色失败',
  [ResultCode.ROLE_NOT_FOUND]: '角色不存在',
  [ResultCode.ROLE_ALREADY_EXIST]: '角色已存在',
  [ResultCode.ROLENAME_ALREADY_EXISTS]: '当前角色名已被占用',
  [ResultCode.ROLELABEL_ALREADY_EXISTS]: '当前标识已被占用',
  [ResultCode.ROLE_BATCH_DELETE_SUCCESS]: '批量删除角色成功',
  [ResultCode.ROLE_BATCH_DELETE_FAILED]: '批量删除角色失败',
  [ResultCode.ROLENAME_AND_LABEL_ALREADY_EXISTS]: '角色与标识已存在',
  [ResultCode.ROLE_ASSIGN_PERMISSION_SUCCESS]: '角色分配权限成功',

  [ResultCode.PERMISSION_CREATED_SUCCESS]: '权限创建成功',
  [ResultCode.PERMISSION_UPDATED_SUCCESS]: '权限更新成功',
  [ResultCode.PERMISSION_DELETED_SUCCESS]: '权限删除成功',
  [ResultCode.PERMISSION_CREATED_FAILED]: '权限创建失败',
  [ResultCode.PERMISSION_UPDATED_FAILED]: '权限更新失败',
  [ResultCode.PERMISSION_DELETED_FAILED]: '权限删除失败',
  [ResultCode.PERMISSION_FINDALL_SUCCESS]: '查询所有权限成功',
  [ResultCode.PERMISSION_FINDALL_FAILED]: '查询所有权限失败',
  [ResultCode.PERMISSION_FINDONE_SUCCESS]: '查询单个权限成功',
  [ResultCode.PERMISSION_FINDONE_FAILED]: '查询单个权限失败',
  [ResultCode.PERMISSION_ALREADY_EXISTS]: '权限名称已被占用',
  [ResultCode.PERMISSION_CODE_ALREADY_EXISTS]: '权限码已被占用',
  [ResultCode.ROUTE_ALREADY_EXISTS]: '权限路由已被占用',
  [ResultCode.PERMISSION_NOT_FOUND]: '权限不存在',
  [ResultCode.USER_GET_ASSIGN_ROLE_SUCCESS]: '获取用户角色成功',
  [ResultCode.USER_ASSIGN_ROLE_SUCCESS]: '用户赋予角色成功',
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
