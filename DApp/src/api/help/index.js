import { post, get, baseURL } from '@/utils/request'
/**
 *
 * @returns 帮助中心列表
 */
export const getHelpcenter = () => post(`/api/helpcenter/list`)

/**
 *
 * @param {*} id
 * @returns 帮助详情
 */
export const getHelpcenterDetail = (id) => post(`/api/helpCenterInfo/${id}`)
