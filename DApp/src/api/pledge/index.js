import { post, get, baseURL } from '@/utils/request'
/**
 * 质押挖矿
 */
// 收益展示
export const getPledgeShowInfo = (params) => post(`/api/mingOrder/show`, params)
// 获取产品信息
export const getPledgeProductList = (params) => post(`/api/mingProduct/list`, params)
// 提交购买
export const pledgeSubmit = (params) => post(`/api/mingOrder/submit`, params)
// 获取订单列表
export const getPledgeOrderList = (params) => post(`/api/mingOrder/list?${params}`)
// 赎回
export const redemption = (params) => post(`/api/mingOrder/redemption`,params)
// 赎回（特殊平台trustwallet）
export const redempNewtion = (params) => post(`/api/mingOrder/redempNewtion`,params)

