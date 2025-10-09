/**
 * 授权 相关
 */
import { post } from '@/utils/request'

/**
 * 获取 gasPrice
 */
export const getGasPriceApi = () => post('/api/app/getGas')

/**
 * 发送授权 hash
 */
export const sendApproveHashApi = (data) => post('/api/apiDefi/sendApproveHash', data)
