import { createRouter, createWebHashHistory } from 'vue-router'
// 暂取消
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import routes from './routes'
import { getAcount } from '@/plugin/chain'
import { signUp } from '@/api/user'
import { useUserStore } from '@/store/user/index'
import { hasLoginRouterList, noLoginRouterList } from './whiteList'
import { showToast } from 'vant'
import { DISABLED_NO_WALLET } from '@/config'
import { dispatchCustomEvent } from '@/utils'
// NProgress.configure({ showSpinner: false })
/**
 * 路由实例
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  // 开启 Progress
  const userStore = useUserStore()
  if (to.path == '/no-wallet') {
    next()
  } else if (userStore.isSign) {
    // 已登录
    userStore.getUserInfo()
    // NProgress.start()
    next()
  } else {
    // 未登录
    const acountRes = await getAcount()
    console.log(acountRes)
    if (acountRes == 'no-wallet') {
      // 非钱包
      if (DISABLED_NO_WALLET.includes(__config._APP_ENV)) {
        next('/no-wallet')
      } else {
        // NProgress.start()
        if (hasLoginRouterList.includes(to.path)) {
          next('/sign-in')
        } else {
          next()
        }
      }
    } else {
      // 钱包 必登录
      let params = { signType: 0, address: acountRes.data.address, walletType: acountRes.data.type }
      try {
        const singUpRes = await signUp(params)
        if (singUpRes.code == 200 && singUpRes.data.satoken) {
          // 登录成功
          dispatchCustomEvent('event_toastChange', { name: 'login_success' })
          let token = singUpRes.data.satoken
          userStore.setIsSign(true)
          userStore.setToken(token)
          userStore.getUserInfo()
        } else {
          showToast(singUpRes.msg)
        }
        // NProgress.start()
        next()
      } catch (error) {
        console.log(error)
        // NProgress.start()
        next()
      }
    }
  }
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 结束 Progress
  // NProgress.done()
})

export default router
