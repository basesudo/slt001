/*
 * @Autor: Aka
 * @Date: 2023-07-13 18:43:24
 * @Description:
 * @LastEditTime: 2023-07-24 14:33:00
 */
import request from "@/utils/request";
/** 获取设置配置 */
export function getRechargeConfig(type) {
  return request({
    url: `/setting/get/${type}`,
    method: "get",
  });
}
/** 保存设置配置 */
export function saveRecharge(type, data) {
  return request({
    url: `/setting/put/${type}`,
    method: "put",
    data,
  });
}

/** 时区列表 */
export function getTimezone() {
  return request({
    url: `/bussiness/timezone/list`,
    method: "get",
  });
}

/** 保存设置配置 */
export function getAllRecharge(query) {
  return request({
    url: "/bussiness/recharge/getAllRecharge",
    method: "post",
    params: query,
  });
}
