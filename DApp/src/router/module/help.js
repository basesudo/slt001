export default [
  // 帮助列表
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/help/index.vue')
  },
  {
    path: '/helpDetail/:id',
    name: 'HelpDetail',
    component: () => import('@/views/help/helpDetail.vue')
  }
]
