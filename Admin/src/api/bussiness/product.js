import request from '@/utils/request'

// 查询借贷产品列表
export function listProduct(query) {
  return request({
    url: '/bussiness/load/product/list',
    method: 'get',
    params: query
  })
}

// 查询借贷产品详细
export function getProduct(id) {
  return request({
    url: '/bussiness/load/product/' + id,
    method: 'get'
  })
}

// 新增借贷产品
export function addProduct(data) {
  return request({
    url: '/bussiness/load/product',
    method: 'post',
    data: data
  })
}

// 修改借贷产品
export function updateProduct(data) {
  return request({
    url: '/bussiness/load/product',
    method: 'put',
    data: data
  })
}

// 删除借贷产品
export function delProduct(id) {
  return request({
    url: '/bussiness/load/product/' + id,
    method: 'delete'
  })
}
