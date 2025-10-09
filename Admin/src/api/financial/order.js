/*
 * @Autor: Aka
 * @Date: 2023-07-20 14:26:38
 * @Description:
 * @LastEditTime: 2023-07-20 14:26:50
 */
import request from "@/utils/request";

// 查询【请填写功能名称】列表
export function listOrder(query) {
  return request({
    url: "/bussiness/order/list",
    method: "get",
    params: query,
  });
}

// 查询【请填写功能名称】详细
export function getOrder(id) {
  return request({
    url: "/bussiness/order/" + id,
    method: "get",
  });
}

// 新增【请填写功能名称】
export function addOrder(data) {
  return request({
    url: "/bussiness/order",
    method: "post",
    data: data,
  });
}

// 修改【请填写功能名称】
export function updateOrder(data) {
  return request({
    url: "/bussiness/order",
    method: "put",
    data: data,
  });
}

// 删除【请填写功能名称】
export function delOrder(id) {
  return request({
    url: "/bussiness/order/" + id,
    method: "delete",
  });
}

// 是否同意赎回
export function reCallOrder(id) {
  return request({
    url: `/bussiness/order/reCall?id=${id}`,
    method: "put",
  });
}
