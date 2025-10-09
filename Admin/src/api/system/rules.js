import request from "@/utils/request";

// 查询前台文本配置列表
export function listRules(query) {
  return request({
    url: "/bussiness/option/rules/list",
    method: "get",
    params: query,
  });
}

//查询前台标签页
export function getLabelList(query) {
  return request({
    url: "/bussiness/option/rules/labelList",
    method: "get",
    params: query,
  });
}

// 查询前台文本配置详细
export function getRules(id) {
  return request({
    url: "/bussiness/option/rules/" + id,
    method: "get",
  });
}

// 新增前台文本配置
export function addRules(data) {
  return request({
    url: "/bussiness/option/rules",
    method: "post",
    data: data,
  });
}

// 修改前台文本配置
export function updateRules(data) {
  return request({
    url: "/bussiness/option/rules",
    method: "put",
    data: data,
  });
}

// 删除前台文本配置
export function delRules(id) {
  return request({
    url: "/bussiness/option/rules/" + id,
    method: "delete",
  });
}
