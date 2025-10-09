/**
 * kline 相关
 */
import { post } from '@/utils/request'

/**
 * k线历史数据
 */
export const getKlineHistory = (parmas) => post('/kline', parmas)
