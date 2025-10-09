import request from '@/utils/request'

// 查询mingProduct列表
export function listMing(query) {
  return request({
    url: '/bussiness/ming/list',
    method: 'get',
    params: query
  })
}

// 查询mingProduct详细
export function getMing(id) {
  return request({
    url: '/bussiness/ming/' + id,
    method: 'get'
  })
}

// 新增mingProduct
export function addMing(data) {
  return request({
    url: '/bussiness/ming',
    method: 'post',
    data: data
  })
}

// 修改mingProduct
export function updateMing(data) {
  return request({
    url: '/bussiness/ming',
    method: 'put',
    data: data
  })
}

// 删除mingProduct
export function delMing(id) {
  return request({
    url: '/bussiness/ming/' + id,
    method: 'delete'
  })
}

// 限购列表查询
export function pledgeList(query) {
  return request({
    // url: `/bussiness/productUser/list/?productId=${id}`,
    url: `/bussiness/productUser/list`,
    method: 'get',
    params: query
  })
}
// 查询所有用户列表
export function listUserAll(id) {
  return request({
    url: `/bussiness/user/getListByPledge?productId=${id}`,
    // url: `/bussiness/user/getListByPledge`,
    method: 'get'
  })
}
// 添加限购
export function addPledge(data){
  return request({
    url:`/bussiness/productUser`,
    method:'post',
    data
  })
}
// 修改限购
export function updatePledge(data) {
  return request({
    url: '/bussiness/productUser',
    method: 'put',
    data: data
  })
}
// 删除限购
export function delPledge(id) {
  return request({
    url: '/bussiness/productUser/' + id,
    method: 'delete'
  })
}
