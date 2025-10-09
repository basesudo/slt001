import request from '@/utils/request'

// 查询U本位委托列表
export function listContractOrder(query) {
  return request({
    url: '/bussiness/contractOrder/list',
    method: 'get',
    params: query
  })
}

// 查询U本位委托详细
export function getContractOrder(id) {
  return request({
    url: '/bussiness/contractOrder/' + id,
    method: 'get'
  })
}

// 新增U本位委托
export function addContractOrder(data) {
  return request({
    url: '/bussiness/contractOrder',
    method: 'post',
    data: data
  })
}

// 修改U本位委托
export function updateContractOrder(data) {
  return request({
    url: '/bussiness/contractOrder',
    method: 'put',
    data: data
  })
}

// 删除U本位委托
export function delContractOrder(id) {
  return request({
    url: '/bussiness/contractOrder/' + id,
    method: 'delete'
  })
}
