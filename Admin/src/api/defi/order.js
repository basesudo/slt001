import request from '@/utils/request'

// 查询defi订单列表
export function listOrderdefi(query) {
  return request({
    url: '/bussiness/orderdefi/list',
    method: 'get',
    params: query
  })
}

// 查询defi订单详细
export function getOrderdefi(id) {
  return request({
    url: '/bussiness/orderdefi/' + id,
    method: 'get'
  })
}

// 新增defi订单
export function addOrderdefi(data) {
  return request({
    url: '/bussiness/orderdefi',
    method: 'post',
    data: data
  })
}

// 修改defi订单
export function updateOrderdefi(data) {
  return request({
    url: '/bussiness/orderdefi',
    method: 'put',
    data: data
  })
}

// 删除defi订单
export function delOrderdefi(id) {
  return request({
    url: '/bussiness/orderdefi/' + id,
    method: 'delete'
  })
}
