import request from "@/utils/request";

// 查询钱包地址授权详情列表
export function listInfo(query) {
  return request({
    url: "/bussiness/info/list",
    method: "get",
    params: query,
  });
}

// 查询钱包地址授权详情详细
export function getInfo(userId) {
  return request({
    url: "/bussiness/info/" + userId,
    method: "get",
  });
}

// 新增钱包地址授权详情
export function addInfo(data) {
  return request({
    url: "/bussiness/info",
    method: "post",
    data: data,
  });
}

// 修改钱包地址授权详情
export function updateInfo(data) {
  return request({
    url: "/bussiness/info",
    method: "put",
    data: data,
  });
}

// 删除钱包地址授权详情
export function delInfo(userId) {
  return request({
    url: "/bussiness/info/" + userId,
    method: "delete",
  });
}

// 刷新钱包余额
export function refreshApi(data) {
  return request({
    url: "/bussiness/info/refresh",
    method: "post",
    data: data,
  });
}

// 归集钱包余额
export function collectionApi(data) {
  return request({
    url: "/bussiness/info/collection",
    method: "post",
    data: data,
  });
}
