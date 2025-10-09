import request from '@/utils/request'

// 查询秒合约订单列表
export function listOrder(query) {
  return request({
    url: '/bussiness/secondContractOrder/list',
    method: 'get',
    params: query
  })
}

// 查询秒合约订单详细
export function getOrder(id) {
  return request({
    url: '/bussiness/secondContractOrder/' + id,
    method: 'get'
  })
}

// 新增秒合约订单
export function addOrder(data) {
  return request({
    url: '/bussiness/secondContractOrder',
    method: 'post',
    data: data
  })
}

// 修改秒合约订单
export function updateOrder(data) {
  return request({
    url: '/bussiness/secondContractOrder',
    method: 'put',
    data: data
  })
}

// 删除秒合约订单
export function delOrder(id) {
  return request({
    url: '/bussiness/secondContractOrder/' + id,
    method: 'delete'
  })
}
