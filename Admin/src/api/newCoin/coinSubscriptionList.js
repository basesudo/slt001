import request from "@/utils/request";

/**
 * 查询用户订阅记录列表
 */
export function getSubscribeListApi(query) {
  return request({
    url: "/bussiness/ownCoin/subscribeList",
    method: "get",
    params: query,
  });
}
// 获取订阅详情
export function getSubOrderApi(id) {
  return request({
    url: `/bussiness/ownCoin/subOrder/${id}`,
    method: "get",
  });
}

// 审批用户订阅
export function approvalSubOrderApi(data) {
  return request({
    url: "/bussiness/ownCoin/editSubscribe",
    method: "post",
    data: data,
  });
}
