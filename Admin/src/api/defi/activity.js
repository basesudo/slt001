import request from '@/utils/request'

// 查询空投活动列表
export function listActivitydefi(query) {
  return request({
    url: '/bussiness/activitydefi/list',
    method: 'get',
    params: query
  })
}

// 查询空投活动详细
export function getActivitydefi(id) {
  return request({
    url: '/bussiness/activitydefi/' + id,
    method: 'get'
  })
}

// 新增空投活动
export function addActivitydefi(data) {
  return request({
    url: '/bussiness/activitydefi',
    method: 'post',
    data: data
  })
}

// 修改空投活动
export function updateActivitydefi(data) {
  return request({
    url: '/bussiness/activitydefi',
    method: 'put',
    data: data
  })
}

// 删除空投活动
export function delActivitydefi(id) {
  return request({
    url: '/bussiness/activitydefi/' + id,
    method: 'delete'
  })
}
