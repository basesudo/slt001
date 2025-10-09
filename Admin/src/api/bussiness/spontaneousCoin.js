import request from "@/utils/request";

// 查询发币列表
export function listCoin(query) {
  return request({
    url: "/bussiness/spontaneousCoin/list",
    method: "get",
    params: query,
  });
}

// 查询发币详细
export function getCoin(id) {
  return request({
    url: "/bussiness/spontaneousCoin/" + id,
    method: "get",
  });
}

// 新增发币
export function addCoin(data) {
  return request({
    url: "/bussiness/spontaneousCoin",
    method: "post",
    data: data,
  });
}

// 修改发币
export function updateCoin(data) {
  return request({
    url: "/bussiness/spontaneousCoin",
    method: "put",
    data: data,
  });
}

// 删除发币
export function delCoin(id) {
  return request({
    url: "/bussiness/spontaneousCoin/" + id,
    method: "delete",
  });
}

// 查询价格
export function getCoinPrice(data) {
  return request({
    url: "/common/getCoinPrice",
    method: "post",
    data: data,
  });
}
