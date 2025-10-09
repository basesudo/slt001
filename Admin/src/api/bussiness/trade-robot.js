import request from "@/utils/request";

/**
 * 获取控线币种列表
 * @param {*} data
 * @returns
 */
export function getSymbolListApi() {
  return request({
    url: "/bussiness/model/symbolList",
    method: "post",
  });
}

/**
 * 保存控线数据
 * @param {*} data
 * @returns
 */
export function saveTradeRobotApi(data) {
  return request({
    url: "/bussiness/model",
    method: "post",
    data: data,
  });
}

/**
 * 获取历史控线数据列表
 */
export function getDataListApi(params) {
  return request({
    url: "/bussiness/model/list",
    method: "get",
    params: params,
  });
}

/**
 * 获取历史控线详情
 */
export function getDetailApi(id) {
  return request({
    url: `/bussiness/model/${id}`,
    method: "get",
  });
}

/**
 * 删除历史控线详情
 */
export function deleteDetailApi(id) {
  return request({
    url: `/bussiness/model/${id}`,
    method: "delete",
  });
}

/**
 * 更新历史控线详情
 */
export function updateDetailApi(data) {
  return request({
    url: `/bussiness/model`,
    method: "put",
    data: data,
  });
}
