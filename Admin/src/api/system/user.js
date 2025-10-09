import request from "@/utils/request";
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: "/system/user/list",
    method: "get",
    params: query,
  });
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: "/system/user/getInfo/" + parseStrEmpty(userId),
    method: "get",
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: "/system/user",
    method: "post",
    data: data,
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: "/system/user",
    method: "put",
    data: data,
  });
}

// 删除用户
export function delUser(userId) {
  return request({
    url: "/system/user/" + userId,
    method: "delete",
  });
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password,
  };
  return request({
    url: "/system/user/resetPwd",
    method: "put",
    data: data,
  });
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status,
  };
  return request({
    url: "/system/user/changeStatus",
    method: "put",
    data: data,
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: "/system/user/profile",
    method: "get",
  });
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: "/system/user/profile",
    method: "put",
    data: data,
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword,
  };
  return request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    params: data,
  });
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: "/system/user/profile/avatar",
    method: "post",
    data: data,
  });
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: "/system/user/authRole/" + userId,
    method: "get",
  });
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: "/system/user/authRole",
    method: "put",
    params: data,
  });
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: "/system/user/deptTree",
    method: "get",
  });
}

//查询可绑定的代理用户
export function getAdminUserList(params) {
  return request({
    url: "/system/user/selectAllAgentUser",
    method: "get",
    params,
  });
}
//修改上级代理保存
export function updateUserAppIds(data) {
  return request({
    url: "/bussiness/user/updateUserAppIds",
    method: "put",
    params: data,
  });
}
//查询可绑定的玩家用户
export function getAppUserList(params) {
  return request({
    url: "/bussiness/user/selectUnboundAppUser",
    method: "get",
    params,
  });
}

//绑定代理用户
export function bindActing(params) {
  return request({
    url: "/system/user/bindingAdminUser",
    method: "get",
    params,
  });
}

//绑定玩家用户
export function bindGameUser(params) {
  return request({
    url: "/system/user/bindingAppUser",
    method: "get",
    params,
  });
}

//查询代理下的玩家用户列表
export function FundAdminUserList(params) {
  return request({
    url: "/bussiness/user/list",
    method: "get",
  });
}

//  更新googleKey
export function updateCode(query) {
  return request({
    url: "/system/user/updateCode",
    method: "get",
    params: query,
  });
}

//查询googleKey
export function googleCode(query) {
  return request({
    url: "/system/user/googleCode",
    method: "get",
    params: query,
  });
}
