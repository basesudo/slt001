import request from '@/utils/request'

// 查询支持币种列表
export function listSymbols(query) {
  return request({
    url: '/bussiness/symbols/list',
    method: 'get',
    params: query
  })
}

// 查询支持币种详细
export function getSymbols(slug) {
  return request({
    url: '/bussiness/symbols/' + slug,
    method: 'get'
  })
}

// 新增支持币种
export function addSymbols(data) {
  return request({
    url: '/bussiness/symbols',
    method: 'post',
    data: data
  })
}

// 修改支持币种
export function updateSymbols(data) {
  return request({
    url: '/bussiness/symbols',
    method: 'put',
    data: data
  })
}

// 删除支持币种
export function delSymbols(slug) {
  return request({
    url: '/bussiness/symbols/' + slug,
    method: 'delete'
  })
}
