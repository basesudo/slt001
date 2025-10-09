/*
 * @Autor: Aka
 * @Date: 2023-09-01 17:17:31
 * @Description:
 * @LastEditTime: 2023-09-01 17:18:17
 */
import request from "@/utils/request";

// 查询nft订单列表
export function listNftOrder(query) {
  return request({
    url: "/bussiness/nftOrder/list",
    method: "get",
    params: query,
  });
}

// 查询nft订单详细
export function getNftOrder(id) {
  return request({
    url: "/bussiness/nftOrder/" + id,
    method: "get",
  });
}

// 新增nft订单
export function addNftOrder(data) {
  return request({
    url: "/bussiness/nftOrder",
    method: "post",
    data: data,
  });
}

// 修改nft订单
export function updateNftOrder(data) {
  return request({
    url: "/bussiness/nftOrder",
    method: "put",
    data: data,
  });
}

// 删除nft订单
export function delNftOrder(id) {
  return request({
    url: "/bussiness/nftOrder/" + id,
    method: "delete",
  });
}
