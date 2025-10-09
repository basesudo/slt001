export default [
  // 助力贷
  {
    path: '/loan',
    name: 'Loan',
    component: () => import('@/views/loan/index.vue')
  },
  // 助力贷记录
  {
    path: '/loan-record',
    name: 'LoanRecord',
    component: () => import('@/views/loan/loan-record.vue')
  }, // 助力贷顾泽
  {
    path: '/loan-rule',
    name: 'LoanRule',
    component: () => import('@/views/loan/loan-rule.vue')
  }
]
