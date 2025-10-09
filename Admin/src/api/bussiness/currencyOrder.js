import request from "@/utils/request";

// 查询币币交易订单列表
export function listOrder(query) {
  return request({
    url: "/bussiness/currency/order/list",
    method: "get",
    params: query,
  });
}
