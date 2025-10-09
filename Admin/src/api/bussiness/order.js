import request from '@/utils/request'

// 查询ming列表
export function listOrder(query) {
  return request({
    url: '/bussiness/ming/order/list',
    method: 'get',
    params: query
  })
}

// 查询ming详细
export function getOrder(id) {
  return request({
    url: '/bussiness/ming/order/' + id,
    method: 'get'
  })
}

// 新增ming
export function addOrder(data) {
  return request({
    url: '/bussiness/ming/order',
    method: 'post',
    data: data
  })
}

// 修改ming
export function updateOrder(data) {
  return request({
    url: '/bussiness/ming/order',
    method: 'put',
    data: data
  })
}

// 删除ming
export function delOrder(id) {
  return request({
    url: '/bussiness/ming/order/' + id,
    method: 'delete'
  })
}
