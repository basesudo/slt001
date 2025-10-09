// 充值,提现,兑换,划转,银行卡
import { post, get, baseURL } from '@/utils/request'
/**
 * 查询用户资产信息
 */
export const getUserBalance = () => post('/api/asset/assetBalance')

/**
 * 充值*********************************************************************************
 */
// 获取生成的充值地址(rxce,gmdoin)
export const getUserRechageNewApi = (coin, symbol) =>
  post(`/api/recharge/getAdress?coin=${coin}&symbol=${symbol}`)
// 获取充值地址
export const getUserRechage = () => post('/api/recharge/userRechage')
// 获取充值方式
export const getAppCurrencyList = () => post('/api/common/getAppCurrencyList')
// 获取充值地址
// export const getRechargeSetting = () => post('/api/common/getRechargeSetting')
// 提交充值
export const rechargeSubmit = (params) => post('/api/recharge/submit', params)
// 查询充值记录
export const getRechargeList = (params) => post(`/api/recharge/list?${params}`)
// 查询充值记录详情
export const getRechargeDetail = (params) => post(`/api/recharge/${params}`)
/**
 * 提现*********************************************************************************
 */
// 获取提现方式
export const getWithDrawSetting = () => post('/api/common/getWithDrawCoinList')
// 提交提现
// export const withdrawSubmit = (amount, coinType, pwd, adress, coin) =>
//   post(
//     `/api/withdraw/submit?amount=${amount}&coinType=${coinType}&pwd=${pwd}&adress=${adress}&coin=${coin}`
//   )
export const withdrawSubmit = (params) => post(`/api/withdraw/submit?${params}`)
// 查询提现记录
export const getWithdrawList = (params) => post(`/api/withdraw/list?${params}`)
// 查询充值记录详情
export const getWithdrawDetail = (id) => post(`/api/withdraw/detail?id=${id}`)
// 查询提现状态 hfm2
export const getCacheStatus = () => post(`/api/withdraw/getWithdrawStatus`)
// 查询提现地址
export const haveCacheAddress = (params) => post(`/api/withdraw/haveCacheAddress`, params)
// 保存提现地址
export const saveCacheAddress = (params) => post(`/api/withdraw/saveCacheAddress`, params)
/**
 * 兑换*********************************************************************************
 */
// 获取兑换 币种列表
export const getSwapSetting = (data) =>
  post(`/api/symbolmanage/list?isAsc=${data.isAsc}&orderByColumn=${data.orderByColumn}`)
// 获取不同币种兑换汇率
export const rate = (from, to) => post(`/api/texchange/getCurrencyPrice?currency=${from},${to}`)
// 兑换接口
export const toExchange = (params) => post('/api/texchange/currencyExchange', params)
/**
 * 划转*********************************************************************************
 */
export const getTransferList = (params) => post('/api/asset/transferFunds', params)

/**
 * 银行卡******************************************************************************
 */
// 绑定银行
export const bindCardSubmit = (params) => post('/api/userBank/save', params)
// 银行卡列表
export const getBindCardList = (params) => post('/api/userBank/getbank', params)
// 修改银行卡
export const updateBindCard = (params) => post('/api/userBank/update', params)
// 删除银行卡
export const delBindCard = (ids) => post(`/api/userBank/${ids}`)

/**
 * 绑定地址
 * @param { object } data
 * @param { string } data.address
 * @param { string } data.userId
 * @returns {AxiosPromise}
 *
 */
export const updateUserAddress = (params) =>
  post(
    `/api/user/updateUserAddress?type=${params.type}&address=${params.address}&userId=${params.userId}`
  )
