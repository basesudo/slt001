export default [
  // 添加自选
  {
    path: '/addOptional',
    name: 'AddOptional',
    component: () => import('@/views/quote/optional/addOptional.vue')
  },
  // 编辑自选
  {
    path: '/editOptional',
    name: 'EditOptional',
    component: () => import('@/views/quote/optional/editOptional.vue')
  }
]
