export default [
  // 交易规则
  {
    path: '/tradingRules',
    name: 'tradingRules',
    component: () => import('@/views/trade/tradingRules.vue')
  },
  // 详情
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('@/views/trade/detail.vue')
  }
]
