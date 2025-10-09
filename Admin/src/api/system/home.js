import request from "@/utils/request";

// 获取首页统计数据
export function statisticsDataList(query) {
  return request({
    url: "/system/statistics/dataList",
    method: "get",
    params: query,
  });
}
