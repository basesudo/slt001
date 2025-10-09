import request from "@/utils/request";

// 查询用户充值列表
export function listRecharge(query) {
  return request({
    url: "/bussiness/recharge/list",
    method: "get",
    params: query,
  });
}

// 查询用户充值详细
export function getRecharge(id) {
  return request({
    url: "/bussiness/recharge/" + id,
    method: "get",
  });
}

/**充值审核通过 */

export function passRecharge(data) {
  return request({
    url: "/bussiness/recharge/passOrder",
    method: "post",
    data: data,
  });
}

/**充值审核失败 */
export function unRecharge(data) {
  return request({
    url: "/bussiness/recharge/failedOrder",
    method: "post",
    data: data,
  });
}
