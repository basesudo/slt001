export default [
  // 充值
  {
    path: '/recharge',
    name: 'Recharge',
    component: () => import('@/views/assets/recharge/index.vue')
  },
  // 充值申请
  {
    path: '/recharge-apply',
    name: 'RechargeApply',
    component: () => import('@/views/assets/recharge/recharge-apply.vue')
  },
  // 充值记录
  {
    path: '/recharge-order',
    name: 'RechargOrder',
    component: () => import('@/views/assets/recharge/recharge-order.vue')
  },
  // 充值详情
  {
    path: '/recharge-detail',
    name: 'RechargDetail',
    component: () => import('@/views/assets/recharge/recharge-detail.vue')
  },

  // 提现
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: () => import('@/views/assets/withdraw/index.vue')
  },
  // 提现申请
  {
    path: '/withdraw-apply',
    name: 'WithdrawApply',
    component: () => import('@/views/assets/withdraw/withdraw-apply.vue')
  },
  // 提现记录
  {
    path: '/withdraw-order',
    name: 'WithdrawOrder',
    component: () => import('@/views/assets/withdraw/withdraw-order.vue')
  },
  // 提现详情
  {
    path: '/withdraw-detail',
    name: 'WithdrawDetail',
    component: () => import('@/views/assets/withdraw/withdraw-detail.vue')
  },
  // 兑换
  {
    path: '/swap',
    name: 'Swap',
    component: () => import('@/views/assets/swap/index.vue')
  },
  //划转transfer
  {
    path: '/transfer',
    name: 'Transfer',
    component: () => import('@/views/assets/transfer/index.vue')
  },
]
