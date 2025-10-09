export default [
  // 质押挖矿
  {
    path: '/pledge',
    name: 'Pledge',
    component: () => import('@/views/pledge/index.vue')
  },
  // 质押挖矿详情
  {
    path: '/pledge/pledgeDetail',
    name: 'PledgeDetail',
    component: () => import('@/views/pledge/pledgeDetail.vue')
  },
  // 质押挖矿记录
  {
    path: '/pledge/pledgeOrder',
    name: 'PledgeOrder',
    component: () => import('@/views/pledge/pledgeOrder.vue')
  }
]
