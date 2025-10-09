import request from "@/utils/request";

// 查询U本位持仓表列表
export function listPosition(query) {
  return request({
    url: "/bussiness/position/list",
    method: "get",
    params: query,
  });
}

// 查询U本位持仓表详细
export function getPosition(id) {
  return request({
    url: "/bussiness/position/" + id,
    method: "get",
  });
}

// 新增U本位持仓表
export function addPosition(data) {
  return request({
    url: "/bussiness/position",
    method: "post",
    data: data,
  });
}

// 修改U本位持仓表
export function updatePosition(data) {
  return request({
    url: "/bussiness/position",
    method: "put",
    data: data,
  });
}

// 删除U本位持仓表
export function delPosition(id) {
  return request({
    url: "/bussiness/position/" + id,
    method: "delete",
  });
}

// U本位止盈止损
export function getProfitList(id) {
  return request({
    url: "/bussiness/position/contractLoss/" + id,
    method: "post",
  });
}

export function passReview(data) {
  return request({
    url: "/bussiness/position/pass",
    method: "put",
    data: data,
  });
}

export function reject(data) {
  return request({
    url: "/bussiness/position/reject",
    method: "put",
    data: data,
  });
}

// U本位止盈止损
export function stopPositon(data) {
  return request({
    url: "/bussiness/position/stopPositon",
    method: "post",
    data: data,
  });
}
export function stopAllPositon(data) {
  return request({
    url: "/bussiness/position/stopAllPositon",
    method: "post",
    data: data,
  });
}
