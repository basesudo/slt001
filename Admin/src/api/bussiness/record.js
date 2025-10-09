import request from "@/utils/request";

// 查询用户信息列表
export function listRecord(query) {
  return request({
    url: "/bussiness/wallet/record/list",
    method: "get",
    params: query,
  });
}

// 查询账变类型
export function getType(data) {
  return request({
    url: "/common/recordType",
    method: "post",
    data: data,
  });
}

export function getTotalMoney() {
  return request({
    url: "/bussiness/wallet/record/statisticsAmount",
    method: "post",
  });
}

// 查询用户信息详细
export function getRecord(id) {
  return request({
    url: "/bussiness/wallet/record/" + id,
    method: "get",
  });
}

// 新增用户信息
export function addRecord(data) {
  return request({
    url: "/bussiness/record",
    method: "post",
    data: data,
  });
}

// 修改用户信息
export function updateRecord(data) {
  return request({
    url: "/bussiness/wallet/record",
    method: "put",
    data: data,
  });
}

// 删除用户信息
export function delRecord(id) {
  return request({
    url: "/bussiness/wallet/record/" + id,
    method: "delete",
  });
}
