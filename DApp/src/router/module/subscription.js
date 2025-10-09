// 申购
export default [
    // 认购
    {
      path: '/subscription',
      name: 'Subscription',
      component: () => import('@/views/subscription/index.vue')
    },
    // 认购记录
    {
      path: '/subscription/order',
      name: 'Subscription-order',
      component: () => import('@/views/subscription/order.vue')
    },
    //详情
    {
      path: '/subscription/info',
      name: 'Subscription-info',
      component: () => import('@/views/subscription/info.vue')
    },
    //申请申购
    {
      path: '/subscription/apply',
      name: 'Subscription-apply',
      component: () => import('@/views/subscription/apply.vue')
    },
  ]
  