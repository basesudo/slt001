import request from "@/utils/request";

// 查询每日数据详情
export function listData(query) {
  return request({
    url: "/bussiness/userStatistics/list",
    method: "get",
    params: query,
  });
}

// 查询代理数据详情
export function agencyList(query) {
  return request({
    url: "/bussiness/userStatistics/agencyList",
    method: "get",
    params: query,
  });
}

// 查询代理下级玩家用户数据详情
export function agencyAppUserList(query) {
  return request({
    url: "/bussiness/userStatistics/agencyAppUserList",
    method: "get",
    params: query,
  });
}

// 查询代理下级玩家用户数据详情
export function dailyData(query) {
  return request({
    url: "/bussiness/userStatistics/dailyData",
    method: "get",
    params: query,
  });
}
