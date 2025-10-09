import request from "@/utils/request";

// 查询币种管理列表
export function listManage(query) {
  return request({
    url: "/bussiness/symbolmanage/list",
    method: "get",
    params: query,
  });
}

// 查询可添加币种列表
export function getCoinList() {
  return request({
    url: "/bussiness/klineSymbol/list",
    method: "get",
  });
}
// 一键新增
export function addCoin(data) {
  return request({
    url: "/bussiness/symbolmanage/addBatch/",
    method: "post",
    params: data,
  });
}
// 查询币种管理详细
export function getManage(id) {
  return request({
    url: "/bussiness/symbolmanage/" + id,
    method: "get",
  });
}

// 新增币种管理
export function addManage(data) {
  return request({
    url: "/bussiness/symbolmanage",
    method: "post",
    data: data,
  });
}

// 修改币种管理
export function updateManage(data) {
  return request({
    url: "/bussiness/symbolmanage",
    method: "put",
    data: data,
  });
}

// 删除币种管理
export function delManage(id) {
  return request({
    url: "/bussiness/symbolmanage/" + id,
    method: "delete",
  });
}

// 查询币种兑换记录
export function swapRecordList(query) {
  return request({
    url: "/bussiness/texchange/list",
    method: "get",
    params: query,
  });
}
