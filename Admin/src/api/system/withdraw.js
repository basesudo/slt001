import request from "@/utils/request";

// 查询用户提现列表
export function listWithdraw(query) {
  return request({
    url: "/bussiness/withdraw/list",
    method: "get",
    params: query,
  });
}
//提现管理.锁定
export function lockorder(data) {
  return request({
    url: "/bussiness/withdraw/lockorder",
    method: "post",
    data: data,
  });
}

//提现管理.解锁
export function unlockorder(data) {
  return request({
    url: "/bussiness/withdraw/unlockorder",
    method: "post",
    data: data,
  });
}

//提现管理.锁定判断
export function tryCheck(data) {
  return request({
    url: "/bussiness/withdraw/tryCheck",
    method: "post",
    data: data,
  });
}
//提现管理.审核通过
export function withdrawReview(data) {
  return request({
    url: "/bussiness/withdraw/review",
    method: "post",
    data: data,
  });
}
//提现管理.审核拒绝
export function rejectReview(data) {
  return request({
    url: "/bussiness/withdraw/reject",
    method: "post",
    data: data,
  });
}

/** 获取总提现金额 */
export function getAllWithdraw(query) {
  return request({
    url: "/bussiness/withdraw/getAllWithdraw",
    method: "post",
    params: query,
  });
}
