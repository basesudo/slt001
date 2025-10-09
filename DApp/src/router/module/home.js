export default [
  // 搜索
  {
    path: '/tradeSearch',
    name: 'TradeSearch',
    component: () => import('@/views/home/tradeSearch/index.vue')
  },
  // 侧边
  {
    path: '/homeSidebar',
    name: 'HomeSidebar',
    component: () => import('@/views/home/sidebar/index.vue')
  },
  {
    path: '/broadcastDetails',
    name: 'BroadcastDetails',
    component: () => import('@/views/home/BroadcastDetails.vue')
  },
  {
    path: '/addAddress',
    name: 'AddAddress',
    component: () => import('@/views/slidebar/add-address.vue')
  }
]
