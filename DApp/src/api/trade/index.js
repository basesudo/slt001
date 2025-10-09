/**
 * 币种交易相关 api
 */
import { post } from '@/utils/request'
/**
 * 获取所有币种列表 type 1 秒合约 2 币币 3 U本位 4 期权  5 外汇（待定）
 * @returns
 */
export const getCoinListApi = () => post('/api/common/getCoinList')
/**
 * 币币买入卖出
 * @returns
 */
export const submitOrderCurrencyApi = (params) => post('/api/currency/order/submit', params)

/**
 * 币币撤销订单
 * @returns
 */
export const cancelOrderCurrencyApi = (id) => post(`/api/currency/order/cancelOrder?id=${id}`)

/**
 * 获取币币列表
 * @returns
 */
// export const getOrderListCurrencyApi = (params) => post(`/api/currency/order/orderList`)
export const getOrderListCurrencyApi = (params) => post(`/api/currency/order/orderList?${params}`)

/**
 *
 * @param {*} data
 * @returns 查看币种周期配置
 */
export const getPeriodList = (data) => post('/api/period/list', data)

/**
 *
 * @param {*} data
 * @returns 新增秒合约订单
 */
export const createSecondContractOrder = (data) =>
  post('/api/secondContractOrder/createSecondContractOrder', data)

/**
 *
 * @param {*} data
 * @returns 当前/历史委托  秒合约
 */
export const secondContractOrderselectOrderList = (data) =>
  post('/api/secondContractOrder/selectOrderList', data)
/**
 *
 * @param {*} data
 * @returns 提交本位
 */
export const submitUcontract = (data) => post('/api/contract/order/submit', data)

/**
 *
 * @param {*} status  0 当前持仓 1.历史持仓
 * @returns 持仓列表
 */
export const contractHistoryList = (data) =>
  post(`/api/contract/position/list?status=${data.status}`)
/**
 *
 * @param {*} data
 * @returns 极速平仓
 */
export const stopOrder = (data) => post(`/api/contract/position/stopOrder?id=${data.id}`)

/**
 *
 * @param {*} data
 * @returns 调整保证金
 */
export const adjustAmount = (data) =>
  post(`/api/contract/position/adjustAmount?id=${data.id}&money=${data.money}&flag=${data.flag}`)

/**
 *
 * @returns 止盈止损列表
 */
export const contractLossList = () => post(`/api/contract/loss/list`)

/**
 *
 * @param {*} data
 * @returns 止盈止损设置
 */
export const settLoss = (data) => post(`/api/contract/loss/sett`, data)
/**
 *
 * @param {*} data
 * @returns 取消止盈止损
 */
export const cancelLoss = (id) => post(`/api/contract/loss/cancel?id=${id}`)

/**
 *
 * @param {*} data
 * @returns 委托订单列表 0 当前 1 历史
 */
export const orderList = (data) => post(`/api/contract/order/list?status=${data.status}`)

/**
 *
 * @param {*} id
 * @returns 当前委托扯单
 */
export const canCelOrder = (id) => post(`/api/contract/order/canCelOrder?id=${id}`)

/**
 * 收藏币种
 */
export const setCollect = (params) => post(`/api/userCoin/save`, params)

/**
 * rxce平仓
 */

export const stopPosition = (data) => post(`/api/contract/position/stopPosition?id=${data.id}`)
/**
 * 追加保证金  
  
 */
export const adjustPositionMargn = (data) =>
  post(`/api/contract/position/adjustPositionMargn?id=${data.id}&money=${data.money}`)
/**
 * 追加本金
 */
export const adjustPositionAmout = (data) =>
  post(`/api/contract/position/adjustPositionAmout?id=${data.id}&money=${data.money}`)
export const removeCollect = (params) => post(`/api/userCoin/removeByCoin`, params)
/**
 * 获取自选列表
 */
export const getCollect = (params) => post(`/api/userCoin/getUserCoin`, params)
/**
 * 批量添加收藏
 */
export const setCollectAdds = (params) => post(`/api/userCoin/addBath`, params)
/**
 * 批量取消收藏
 */
export const removeCollectRemoves = (ids) => post(`/api/userCoin/remove/${ids}`)
/**
 * 秒合约黄金白银假数据
 */
export const getMt5Amount = (coin) => post(`/api/common/getMt5Amount?coin=${coin}`)
