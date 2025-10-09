import LanguageSelection from '@/views/slidebar/language-selection.vue'
import TermService from '@/views/slidebar/term-service.vue'

export default [
  // 推广
  {
    path: '/plug',
    name: 'plug',
    component: () => import('@/views/slidebar/plug.vue')
  },
  // 高级认证
  {
    path: '/certification-advanced',
    name: 'CertificationAdvanced',
    component: () => import('@/views/slidebar/certification-advanced.vue')
  },
  // 初级认证
  {
    path: '/certification-primary',
    name: 'CertificationPrimary',
    component: () => import('@/views/slidebar/certification-primary.vue')
  },
  // 绑定银行卡
  {
    path: '/bind-card',
    name: 'BindCard',
    component: () => import('@/views/slidebar/bind-card.vue')
  },
  // 设置资金密码
  {
    path: '/fund-password',
    name: 'FundPassword',
    component: () => import('@/views/slidebar/fund-password.vue')
  },
  // 设置密码
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('@/views/slidebar/change-password.vue')
  }, // 邮箱认证
  {
    path: '/email-authentication',
    name: 'EmailAuthentication',
    component: () => import('@/views/slidebar/email-authentication.vue')
  },
  // 服务条款
  {
    path: '/term-service',
    name: 'TermService',
    component: TermService
  }, // 语言

  {
    path: '/language-selection',
    name: 'LanguageSelection',
    component: LanguageSelection
  },

  {
    path: '/bank-list',
    name: 'BankList',
    component: () => import('@/views/slidebar/bank-list.vue')
  },
  {
    path: '/edit-bank',
    name: 'EditBank',
    component: () => import('@/views/slidebar/edit-bank.vue')
  },
  // 等级规则
  {
    path: '/vip-rule',
    name: 'VipRule',
    component: () => import('@/views/slidebar/vip-rule.vue')
  }
]
