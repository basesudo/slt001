/**
 * 推广中心api
 */

import { post, get } from '@/utils/request'
//推广中心统计数据
export const getAgentInfo = () => post('/api/agentActivityInfo/getAgentInfo')
//根据等级获取对应列表
export const getAgentList = (params) => post('/api/agentActivityInfo/getAgentList',params)