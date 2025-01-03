export enum ResultCode {
  // 偶数成功，奇数失败
  SUCCESS = 20000,
  ERROR = 20001,

  USER_CREATED_SUCCESS = 20002,
  USER_CREATED_FAILED = 20003,
  USER_UPDATED_SUCCESS = 20004,
  USER_UPDATED_FAILED = 20005,
  USER_DELETED_SUCCESS = 20006,
  USER_DELETED_FAILED = 20007,
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
};
