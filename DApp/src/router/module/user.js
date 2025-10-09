import SignIn from '@/views/user/sign-in.vue'
import AppDownload from '@/views/user/app-download.vue'

export default [
  // 登录
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn
  },
  // 注册
  {
    path: '/i&:invite_code',
    redirect: (to) => {
      return { name: 'SignIn', query: { invite_code: to.params.invite_code } }
    }
  },

  // 下载
  {
    path: '/app-download',
    name: 'AppDownload',
    component: AppDownload
  },
  // 使用条款
  {
    path: '/termsOfuse',
    name: 'TermsOfuse',
    component: () => import('@/views/user/termsOfuse.vue')
  },

  // 隐私条约
  {
    path: '/privacyPolicy',
    name: 'PrivacyPolicy',
    component: () => import('@/views/user/privacyPolicy.vue')
  },
  // 消息通知
  {
    path: '/notice',
    name: 'Notice',
    component: () => import('@/views/user/notice.vue')
  }
]
