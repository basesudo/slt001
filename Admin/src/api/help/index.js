/*
 * @Autor: Aka
 * @Date: 2023-08-17 17:10:46
 * @Description:
 * @LastEditTime: 2023-08-21 11:27:28
 */
import request from "@/utils/request";

// 帮助列表
export function helpcenter(query) {
  return request({
    url: "/bussiness/helpcenter/list",
    method: "get",
    params: query,
  });
}
/** 新增主表 */
export function addhelpcenter(data) {
  return request({
    url: "/bussiness/helpcenter",
    method: "post",
    data: data,
  });
}
// 修改主表
export function updatehelpcenter(data) {
  return request({
    url: "/bussiness/helpcenter",
    method: "put",
    data: data,
  });
}
/**删除 */
export function delectpcenter(id) {
  return request({
    url: `/bussiness/helpcenter/${id}`,
    method: "delete",
  });
}
// 问题列表
export function helpCenterInfo(query) {
  return request({
    url: "/bussiness/helpCenterInfo/list",
    method: "get",
    params: query,
  });
}
/** 新增问题列表*/
export function addhelpCenterInfo(data) {
  return request({
    url: "/bussiness/helpCenterInfo",
    method: "post",
    data: data,
  });
}
// 问题列表修改
export function updatehelpCenterInfo(data) {
  return request({
    url: "/bussiness/helpCenterInfo",
    method: "put",
    data: data,
  });
}
/**删除 */
export function delecthelpCenterInfo(id) {
  return request({
    url: `/bussiness/helpCenterInfo/${id}`,
    method: "delete",
  });
}
