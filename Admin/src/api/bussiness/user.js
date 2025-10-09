import request from "@/utils/request";

// 查询玩家用户列表
export function listUser(query) {
  return request({
    url: "/bussiness/user/list",
    method: "get",
    params: query,
  });
}
// 查询所有玩家用户列表
export function listUserAll(query) {
  return request({
    url: "/bussiness/user/listAll",
    method: "get",
    params: query,
  });
}
// 查询玩家用户详细
export function getUser(userId) {
  return request({
    url: "/bussiness/user/" + userId,
    method: "get",
  });
}

// 修改玩家用户
export function updateUser(data) {
  return request({
    url: "/bussiness/user",
    method: "put",
    data: data,
  });
}

// 删除玩家用户
export function delUser(userId) {
  return request({
    url: "/bussiness/user/" + userId,
    method: "delete",
  });
}

// 获取资产列表
export const getAssetList = (params) => {
  return request({
    url: "/bussiness/asset/list",
    method: "get",
    params: params,
  });
};

// 人工下分
export const subAmountApi = (data) => {
  return request({
    url: "/bussiness/user/subAmount",
    method: "post",
    data: data,
  });
};
// 赠送彩金
export const sendBousApi = (data) => {
  return request({
    url: "/bussiness/user/sendBous",
    method: "post",
    data: data,
  });
};

// 包赢包输
export const changeWin = (data) => {
  return request({
    url: "/bussiness/user/buff",
    method: "post",
    data: data,
  });
};

// 重置登录密码
export const resetPwd = (data) => {
  return request({
    url: "/bussiness/user/updateLoginPwd",
    method: "post",
    data: data,
  });
};
// 重置资金密码
export const resetFundPwd = (data) => {
  return request({
    url: "/bussiness/user/updateTransPwd",
    method: "post",
    data: data,
  });
};
// 新增用户
export const addUser = (data) => {
  return request({
    url: "/bussiness/user",
    method: "post",
    data: data,
  });
};
// 加入黑名单
export const setUserBlack = (data) => {
  return request({
    url: "/bussiness/user/updateBlackStatus",
    method: "put",
    data: data,
  });
};
