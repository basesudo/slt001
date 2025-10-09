import request from "@/utils/request";

// 查询U本位合约币种列表
export function listUcontract(query) {
  return request({
    url: "/bussiness/ucontract/list",
    method: "get",
    params: query,
  });
}

// 查询U本位合约币种详细
export function getUcontract(id) {
  return request({
    url: "/bussiness/ucontract/" + id,
    method: "get",
  });
}

// 新增U本位合约币种
export function addUcontract(data) {
  return request({
    url: "/bussiness/ucontract",
    method: "post",
    data: data,
  });
}

// 修改U本位合约币种
export function updateUcontract(data) {
  return request({
    url: "/bussiness/ucontract",
    method: "put",
    data: data,
  });
}

// 删除U本位合约币种
export function delUcontract(id) {
  return request({
    url: "/bussiness/ucontract/" + id,
    method: "delete",
  });
}
