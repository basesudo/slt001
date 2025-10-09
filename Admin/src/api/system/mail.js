import request from "@/utils/request";

// 查询1v1站内信列表
export function listMail(query) {
  return request({
    url: "/bussiness/mail/list",
    method: "get",
    params: query,
  });
}

// 查询1v1站内信详细
// export function getMail(id) {
//   return request({
//     url: "/bussiness/mail/" + id,
//     method: "get",
//   });
// }

// 新增1v1站内信
export function addMail(data) {
  return request({
    url: "/bussiness/mail",
    method: "post",
    data: data,
  });
}

// 修改1v1站内信
// export function updateMail(data) {
//   return request({
//     url: "/bussiness/mail",
//     method: "post",
//     data: data,
//   });
// }

// 删除1v1站内信
export function delMail(id) {
  return request({
    url: "/bussiness/mail/" + id,
    method: "delete",
  });
}
