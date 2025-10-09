import request from "@/utils/request";

// 查询币币交易币种配置列表
export function listConfiguration(query) {
  return request({
    url: "/bussiness/currency/symbol/list",
    method: "get",
    params: query,
  });
}
// 查询币币交易币种配置详细
export function getCurrency(id) {
  return request({
    url: "/bussiness/currency/" + id,
    method: "get",
  });
}
// 查询可添加币种列表
export function getCoinList() {
  return request({
    url: "/bussiness/klineSymbol/list",
    method: "get",
  });
}
// 新增币币交易币种配置
export function addCurrency(data) {
  return request({
    url: "/bussiness/currency/symbol",
    method: "post",
    data: data,
  });
}

// 一键新增
export function addOneCurrency(data) {
  return request({
    url: "/bussiness/currency/symbol/addBatch/",
    method: "post",
    params: data,
  });
}

// 修改币币交易币种配置
export function updateCurrency(data) {
  return request({
    url: "/bussiness/currency/symbol",
    method: "put",
    data: data,
  });
}

// 删除币币交易币种配置
export function delCurrency(id) {
  return request({
    url: "/bussiness/currency/symbol/" + id,
    method: "delete",
  });
}
