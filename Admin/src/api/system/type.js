import request from "@/utils/request";

// 查询秒合约币种配置列表
export function listConfig(query) {
  return request({
    url: "/bussiness/coin/list",
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

export function getcopyCoinlist() {
  return request({
    url: "/bussiness/coin/copylist",
    method: "get",
  });
}

// 查询秒合约币种配置详细
export function getConfig(id) {
  return request({
    url: "/bussiness/coin/" + id,
    method: "get",
  });
}

// 新增秒合约币种配置
export function addConfig(data) {
  return request({
    url: "/bussiness/coin",
    method: "post",
    data: data,
  });
}

// 一键新增
export function addCoin(data) {
  return request({
    url: "/bussiness/coin/batchSave/" + data,
    method: "post",
  });
}

// 修改秒合约币种配置
export function updateConfig(data) {
  return request({
    url: "/bussiness/coin",
    method: "put",
    data: data,
  });
}

// 删除秒合约币种配置
export function delConfig(id) {
  return request({
    url: "/bussiness/coin/" + id,
    method: "delete",
  });
}

// 查询复制币种列表
export function getCopyList() {
  return request({
    url: "/bussiness/coin/query/bathCopy",
    method: "post",
  });
}

// 保存复制币种
export function saveCopy(data) {
  return request({
    url: "/bussiness/coin/bathCopyIng",
    method: "post",
    data: data,
  });
}

// 查询可添加币种列表
export function getSelectList() {
  return request({
    url: "/bussiness/klineSymbol/selectList",
    method: "get",
  });
}
