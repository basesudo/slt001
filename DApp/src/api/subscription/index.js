// 申购、发币

import { post, get } from '@/utils/request'
// 申购列表
export const ownCoinList = (status) => post(`/api/ownCoin/list?status=${status}`)
// 创建申购列表
export const ownCoinCreateOrder = (params) => post(`/api/ownCoinOrder/createOrder`, params)
// 查询申购订单
export const getOwnCoinOrder = (params) => get(`/api/ownCoinOrder/list?${params}`)
/**
 * 获取申购详情
 */
export const getOwnCoinDetail = (id) => get(`/api/ownCoin/getDetail/${id}`)

// 订阅接口
export const subscribeCoins = (params) => post('/api/ownCoin/subscribeCoins', params)

//查询用户订阅记录列表
export const subscribeList = (params) => get('/bussiness/ownCoin/subscribeList', params)

// 审批用户订阅
export const editSubscribe = (params) => post('/bussiness/ownCoin/editSubscribe', params)

// 提前发布新币
export const editStatus = (params) => get('/bussiness/ownCoin/editStatus', params)

// 申购新币
export const placing = (params) => post('/api/ownCoinOrder/placing', params)

// 审批申购新币
export const editPlacing = (params) => post('/bussiness/ownCoinOrder/editPlacing', params)
