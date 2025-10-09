import request from '@/utils/request'

// 查询规则说明列表
export function listSetter(query) {
  return request({
    url: '/bussiness/home/setter/list',
    method: 'get',
    params: query
  })
}

// 查询规则说明详细
export function getSetter(id) {
  return request({
    url: '/bussiness/home/setter/' + id,
    method: 'get'
  })
}

// 新增规则说明
export function addSetter(data) {
  return request({
    url: '/bussiness/home/setter',
    method: 'post',
    data: data
  })
}

// 修改规则说明
export function updateSetter(data) {
  return request({
    url: '/bussiness/home/setter',
    method: 'put',
    data: data
  })
}

// 删除规则说明
export function delSetter(id) {
  return request({
    url: '/bussiness/home/setter/' + id,
    method: 'delete'
  })
}
