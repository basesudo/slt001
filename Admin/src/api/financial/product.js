/*
 * @Autor: Aka
 * @Date: 2023-07-20 13:41:14
 * @Description:
 * @LastEditTime: 2023-07-20 13:47:08
 */
import request from "@/utils/request";

// 查询【请填写功能名称】列表
export function listFinancial(query) {
  return request({
    url: "/bussiness/financial/list",
    method: "get",
    params: query,
  });
}

// 查询【请填写功能名称】详细
export function getFinancial(id) {
  return request({
    url: "/bussiness/financial/" + id,
    method: "get",
  });
}

// 新增【请填写功能名称】
export function addFinancial(data) {
  return request({
    url: "/bussiness/financial",
    method: "post",
    data: data,
  });
}

// 修改【请填写功能名称】
export function updateFinancial(data) {
  return request({
    url: "/bussiness/financial",
    method: "put",
    data: data,
  });
}

// 删除【请填写功能名称】
export function delFinancial(id) {
  return request({
    url: "/bussiness/financial/" + id,
    method: "delete",
  });
}
