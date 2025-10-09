/**
 * 借贷api
 */

import { post, get } from '@/utils/request'
// 查询借贷产品
export const getLoanProductList = () => post('/api/load/product/list')

//借贷订单
export const getLoan = (params) => post('/api/load/order/submit', params)

//查询借贷订单

export const getLoanOrderList = (params) => post(`/api/load/order/orderList?${params}`)
