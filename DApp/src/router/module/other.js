import { TEST_PLATFORM } from '@/config'
import NoWallet from '@/views/other/no-wallet.vue'

/*
 * 其他页面 例如 404
 */
const routes = [
  // 非钱包进入
  {
    path: '/no-wallet',
    name: 'NoWallet',
    component: NoWallet
  }
]

if (TEST_PLATFORM.includes(import.meta.env.VITE_APP_ENV)) {
  // 允许测试平台
  routes.push({
    path: '/platform',
    name: 'Platform',
    component: () => import('@/views/other/platform.vue')
  })
}
// 连接钱包独立页
routes.push({
  path: '/connect-wallet/:invite_code?',
  name: 'ConnectWallet',
  component: () => import('@/views/other/connect-wallet.vue')
})
export default routes
