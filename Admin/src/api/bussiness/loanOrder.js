import request from "@/utils/request";

// 查询贷款订单列表
export function listLoadOrder(query) {
  return request({
    url: "/bussiness/load/order/orderList",
    method: "get",
    params: query,
  });
}

// 通过贷款订单
export function passTLoadOrder(data) {
  return request({
    url: "/bussiness/load/order/passTLoadOrder",
    method: "post",
    data: data,
  });
}

// 贷款订单不通过
export function refuseTLoadOrder(data) {
  return request({
    url: "/bussiness/load/order/refuseTLoadOrder",
    method: "post",
    data,
  });
}

// 还款
export function repayment(data) {
  return request({
    url: "/bussiness/load/order/repayment/",
    method: "post",
    params: data,
  });
}

// 查看订单详情
export function getLoadOrder(id) {
  return request({
    url: "/bussiness/load/order/getTLoadOrder/" + id,
    method: "get",
  });
}
