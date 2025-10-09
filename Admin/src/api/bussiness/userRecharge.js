import request from "@/utils/request";

// 查询用户充值地址列表
export function listUserRecharge(query) {
  return request({
    url: "/bussiness/symbol/address/list",
    method: "get",
    params: query,
  });
}

// 查询用户充值地址详细
export function getUserRecharge(id) {
  return request({
    url: "/bussiness/symbol/address/" + id,
    method: "get",
  });
}

// 新增用户充值地址
export function addUserRecharge(data) {
  return request({
    url: "/bussiness/symbol/address",
    method: "post",
    data: data,
  });
}

// 修改用户充值地址
export function updateUserRecharge(data) {
  return request({
    url: "/bussiness/symbol/address",
    method: "put",
    data: data,
  });
}

// 删除用户充值地址
export function delUserRecharge(id) {
  return request({
    url: "/bussiness/symbol/address/" + id,
    method: "delete",
  });
}

export function getAdress(data) {
  return request({
    url: "/bussiness/symbol/address/getAdress",
    method: "post",
    data: data,
  });
}
