import request from '@/utils/request'

// 查询申购订单列表
export function listOwnCoinOrder(query) {
  return request({
    url: '/bussiness/ownCoinOrder/list',
    method: 'get',
    params: query
  })
}

// 查询申购订单详细
export function getOwnCoinOrder(id) {
  return request({
    url: '/bussiness/ownCoinOrder/' + id,
    method: 'get'
  })
}

// 新增申购订单
export function addOwnCoinOrder(data) {
  return request({
    url: '/bussiness/ownCoinOrder',
    method: 'post',
    data: data
  })
}

// 修改申购订单
export function updateOwnCoinOrder(data) {
  return request({
    url: '/bussiness/ownCoinOrder',
    method: 'put',
    data: data
  })
}

// 删除申购订单
export function delOwnCoinOrder(id) {
  return request({
    url: '/bussiness/ownCoinOrder/' + id,
    method: 'delete'
  })
}
