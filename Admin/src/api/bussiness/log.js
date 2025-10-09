import request from '@/utils/request'

// 查询系统访问记录列表
export function listLog(query) {
  return request({
    url: '/bussiness/log/list',
    method: 'get',
    params: query
  })
}

// 查询系统访问记录详细
export function getLog(id) {
  return request({
    url: '/bussiness/log/' + id,
    method: 'get'
  })
}

// 新增系统访问记录
export function addLog(data) {
  return request({
    url: '/bussiness/log',
    method: 'post',
    data: data
  })
}

// 修改系统访问记录
export function updateLog(data) {
  return request({
    url: '/bussiness/log',
    method: 'put',
    data: data
  })
}

// 删除系统访问记录
export function delLog(id) {
  return request({
    url: '/bussiness/log/' + id,
    method: 'delete'
  })
}
