import request from '@/utils/request'

// 查询玩家资产列表
export function listAsset(query) {
  return request({
    url: '/bussiness/asset/list',
    method: 'get',
    params: query
  })
}

// 查询玩家资产详细
export function getAsset(userId) {
  return request({
    url: '/bussiness/asset/' + userId,
    method: 'get'
  })
}

// 新增玩家资产
export function addAsset(data) {
  return request({
    url: '/bussiness/asset',
    method: 'post',
    data: data
  })
}

// 修改玩家资产
export function updateAsset(data) {
  return request({
    url: '/bussiness/asset',
    method: 'put',
    data: data
  })
}

// 删除玩家资产
export function delAsset(userId) {
  return request({
    url: '/bussiness/asset/' + userId,
    method: 'delete'
  })
}
