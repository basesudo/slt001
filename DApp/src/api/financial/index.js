import { post, get, baseURL } from '@/utils/request'
/**
 *
 * @returns 理财列表 空 全部 0 普通 1 会员 2 增值
 */
export const getFinancial = (data) => post(`/api/financial/list`, data)

/**
 *
 * @param {*} id
 * @returns 理财详情
 */
export const financialDetail = (id) => post(`api/financial/${id}`)
/**
 *
 * @param {*} data
 * @returns 理财立即购买
 */
export const financialSubmit = (planId, money, days) =>
  post(`api/financial/submit?planId=${planId}&money=${money}&days=${days}`)

/**
 *
 * @param {*} pageNum  分页
 * @param {*} pageSize 条数
 * @returns 我的投资
 */
export const investmentList = (pageNum, pageSize) =>
  post(`api/order/list?pageNum=${pageNum}&pageSize=${pageSize}`)

/**
 *
 * @returns 我的投资总额
 */
export const personalIncome = () => post(`api/financial/personalIncome`)
