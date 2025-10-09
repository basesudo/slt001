import request from "@/utils/request";

// 查询用户详细信息列表
export function listDetail(query) {
  return request({
    url: "/bussiness/detail/list",
    method: "get",
    params: query,
  });
}

// 查询用户详细信息详细
export function getDetail(id) {
  return request({
    url: "/bussiness/detail/" + id,
    method: "get",
  });
}

// 新增用户详细信息
export function addDetail(data) {
  return request({
    url: "/bussiness/detail",
    method: "post",
    data: data,
  });
}

// 实名认证审核
export function review(data) {
  return request({
    url: "/bussiness/user/realName",
    method: "post",
    data: data,
  });
}

// 修改用户详细信息
export function updateDetail(data) {
  return request({
    url: "/bussiness/detail",
    method: "put",
    data: data,
  });
}

// 删除用户详细信息
export function delDetail(id) {
  return request({
    url: "/bussiness/detail/" + id,
    method: "delete",
  });
}
