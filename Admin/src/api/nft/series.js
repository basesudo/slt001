/*
 * @Autor: Aka
 * @Date: 2023-09-01 17:25:07
 * @Description:
 * @LastEditTime: 2023-09-01 17:25:10
 */
import request from "@/utils/request";

// 查询nft合计列表
export function listSeries(query) {
  return request({
    url: "/bussiness/series/list",
    method: "get",
    params: query,
  });
}

// 查询nft合计详细
export function getSeries(id) {
  return request({
    url: "/bussiness/series/" + id,
    method: "get",
  });
}

// 新增nft合计
export function addSeries(data) {
  return request({
    url: "/bussiness/series",
    method: "post",
    data: data,
  });
}

// 修改nft合计
export function updateSeries(data) {
  return request({
    url: "/bussiness/series",
    method: "put",
    data: data,
  });
}

// 删除nft合计
export function delSeries(id) {
  return request({
    url: "/bussiness/series/" + id,
    method: "delete",
  });
}
