import request from '@/utils/request'

// 查询defi挖矿利率配置列表
export function listRatedefi(query) {
  return request({
    url: '/bussiness/ratedefi/list',
    method: 'get',
    params: query
  })
}

// 查询defi挖矿利率配置详细
export function getRatedefi(id) {
  return request({
    url: '/bussiness/ratedefi/' + id,
    method: 'get'
  })
}

// 新增defi挖矿利率配置
export function addRatedefi(data) {
  return request({
    url: '/bussiness/ratedefi',
    method: 'post',
    data: data
  })
}

// 修改defi挖矿利率配置
export function updateRatedefi(data) {
  return request({
    url: '/bussiness/ratedefi',
    method: 'put',
    data: data
  })
}

// 删除defi挖矿利率配置
export function delRatedefi(id) {
  return request({
    url: '/bussiness/ratedefi/' + id,
    method: 'delete'
  })
}
