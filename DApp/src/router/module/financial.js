export default [
  // 增值收益
  {
    path: '/addIncome',
    name: 'AddIncome',
    component: () => import('@/views/financial/addIncome.vue')
  },
  // 会员专区
  {
    path: '/membersOnly',
    name: 'MembersOnly',
    component: () => import('@/views/financial/membersOnly.vue')
  },
  // 普通产品
  {
    path: '/generalMerchandise',
    name: 'GeneralMerchandise',
    component: () => import('@/views/financial/generalMerchandise.vue')
  },
  // 理财详情
  {
    path: '/financialDetails/:id',
    name: 'FinancialDetails',
    component: () => import('@/views/financial/financialDetails.vue')
  },
  // 购买基金
  {
    path: '/buyFunds/:id',
    name: 'buyFunds',
    component: () => import('@/views/financial/buyFunds.vue')
  },
  // 我的投资
  {
    path: '/myInvestment',
    name: 'MyInvestment',
    component: () => import('@/views/financial/myInvestment.vue')
  },
  // 理财协议
  {
    path: '/financialAgreement',
    name: 'FinancialAgreement',
    component: () => import('@/views/financial/financialAgreement.vue')
  }
]
