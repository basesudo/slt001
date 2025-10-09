import request from "@/utils/request";

// 查询银行卡
export function listBank(query) {
  return request({
    url: "/bussiness/userBank/list",
    method: "get",
    params: query,
  });
}

export function getBank(id) {
  return request({
    url: "/bussiness/userBank/" + id,
    method: "get",
  });
}

export function addBank(data) {
  return request({
    url: "/bussiness/userBank",
    method: "post",
    data: data,
  });
}

export function updateBank(data) {
  return request({
    url: "/bussiness/userBank",
    method: "put",
    data: data,
  });
}

export function delBank(id) {
  return request({
    url: "/bussiness/userBank/" + id,
    method: "delete",
  });
}
