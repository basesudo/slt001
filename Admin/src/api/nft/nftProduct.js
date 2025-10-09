/*
 * @Autor: Aka
 * @Date: 2023-09-01 17:20:56
 * @Description:
 * @LastEditTime: 2023-09-01 17:57:01
 */
import request from "@/utils/request";

// 查询nft详情列表
export function listNftProduct(query) {
  return request({
    url: "/bussiness/nftProduct/list",
    method: "get",
    params: query,
  });
}

// 查询nft详情详细
export function getNftProduct(id) {
  return request({
    url: "/bussiness/nftProduct/" + id,
    method: "get",
  });
}

// 新增nft详情
export function addNftProduct(data) {
  return request({
    url: "/bussiness/nftProduct",
    method: "post",
    data: data,
  });
}

// 修改nft详情
export function updateNftProduct(data) {
  return request({
    url: "/bussiness/nftProduct",
    method: "put",
    data: data,
  });
}

// 删除nft详情
export function delNftProduct(id) {
  return request({
    url: "/bussiness/nftProduct/" + id,
    method: "delete",
  });
}
// 添加合集id list
export function addNftProductList(data) {
  return request({
    url: "/bussiness/series/addProSeries",
    method: "post",
    data: data,
  });
}
