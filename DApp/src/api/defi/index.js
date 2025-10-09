import { post,get } from '@/utils/request'
/**
 * 获取用户输出
 */
export const getUserInvestmentApi = (data) => post(`/api/apiDefi/userInvestment`, data)

/**
 * 获取档位收益比率
 */
export const getDefiRateApi = (data) => post(`/api/apiDefi/getDefiRate`, data)

/**
 * 获取空投 通知
 */
export const getShowDefiActivityNoticeApi = (userId) =>
  post(`/api/apiDefi/showDefiActivityNotice/${userId}`)

/**
 * 获取空投活动
 */
export const showDefiActivityApi = (userId) => post(`/api/apiDefi/showDefiActivity/${userId}`)

/**
 * 获取空投 通知
 */
export const updateDefiActivityApi = (data) => post(`/api/apiDefi/updateDefiActivity`, data)

/**
 * 获取金额（未授权）
 */
export const getOutcomeApi = () => post(`/api/common/getDefiIncomeSetting`)
/**
 * 获取金额（已授权）
 */
export const getIncomeApi = (userId) => post(`/api/apiDefi/showIncome/${userId}`)

/**
 *
 * @param {*} data
 * @returns 挖矿详情
 */
export const showOrderDetail = (data) => get(`/api/apiDefi/showOrder?${data}`)
