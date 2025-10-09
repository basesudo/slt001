import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { getAcount } from '@/plugin/chain'
import { signUp } from '@/api/user'
import { useUserStore } from '@/store/user/index'
import { noLoginRouterList } from './whiteList'
import { showToast } from 'vant'
import { DISABLED_NO_WALLET } from '@/config'
import { dispatchCustomEvent } from '@/utils'
import { storageDict } from '@/config/dict'
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

  // 统一邀请码提取和存储逻辑
  const extractAndStoreInviteCode = async (path, query, params) => {
    try {
      let inviteCode = ''
      
      // 优先级：路径参数 > 查询参数 > 旧的 /i& 格式
      if (params?.invite_code) {
        inviteCode = params.invite_code
      } else if (query?.invite_code) {
        inviteCode = query.invite_code
      } else if (path.includes('/i&')) {
        inviteCode = path.split('/i&')[1]
      }
      
      if (inviteCode) {
        localStorage.setItem(storageDict.ACTIVE_CODE, inviteCode)
        console.log('设置邀请码:', inviteCode)
        return inviteCode
      }
    } catch (e) {
      console.error('邀请码提取失败:', e)
    }
    return null
  }

  // 钱包自动登录逻辑
  const performWalletAutoLogin = async (acountRes, extractedInviteCode = null) => {
    try {
      // 使用提取的邀请码或本地存储的邀请码 @majiaopi6
      const activeCode = extractedInviteCode || localStorage.getItem(storageDict.ACTIVE_CODE) || ''
      const params = activeCode
        ? { activeCode, signType: 0, address: acountRes.data.address, walletType: acountRes.data.type }
        : { signType: 0, address: acountRes.data.address, walletType: acountRes.data.type }
      
      console.log('钱包自动登录参数:', params)
      const singUpRes = await signUp(params)
      if (singUpRes.code == 200 && singUpRes.data.satoken) {
        dispatchCustomEvent('event_toastChange', { name: 'login_success' })
        let token = singUpRes.data.satoken
        userStore.setIsSign(true)
        userStore.setToken(token)
        userStore.getUserInfo()
        
        // 成功登录后清除邀请码，避免重复使用 @majiaopi6
        if (activeCode) {
          localStorage.removeItem(storageDict.ACTIVE_CODE)
          console.log('清除已使用的邀请码:', activeCode)
        }
        return true
      } else {
        console.log('登录失败:', singUpRes.msg)
      }
    } catch (e) {
      console.error('钱包自动登录失败:', e)
    }
    return false
  }

  // 强制访问 /sign-in 时的处理：非钱包 -> /no-wallet；钱包 -> 首页（并尝试自动登录）
  if (to.path === '/sign-in') {
    if (userStore.isSign) {
      next({ path: '/', replace: true })
      return
    }
    // 提取邀请码
    const extractedInviteCode = await extractAndStoreInviteCode(to.path, to.query, to.params)
    
    const acountRes = await getAcount()
    if (acountRes === 'no-wallet') {
      next({ path: '/no-wallet', replace: true })
      return
    }
    
    // 尝试自动登录
    await performWalletAutoLogin(acountRes, extractedInviteCode)
    
    next({ path: '/', replace: true })
    return
  }
  
  if (to.path == '/no-wallet') {
    next()
  } else if (userStore.isSign) {
    // 已登录
    userStore.getUserInfo()

    // 处理已登录用户访问邀请链接的情况，直接跳转首页
    if (to.path.indexOf('/i&') > -1 || to.path.startsWith('/connect-wallet/')) {
      next({ path: '/', replace: true })
    } else {
      next()
    }
  } else {
    // 未登录 - 提取邀请码
    const extractedInviteCode = await extractAndStoreInviteCode(to.path, to.query, to.params)
    
    const acountRes = await getAcount()
    console.log(acountRes)
    if (acountRes == 'no-wallet') {
      // 非钱包：禁止进入非白名单路由，提示在钱包内操作
      if (to.path.indexOf('/i&') > -1) {
        // 旧格式邀请链接 - 重定向到登录页面
        next({ path: '/sign-in', query: { invite_code: extractedInviteCode }, replace: true })
      } else if (to.path.startsWith('/connect-wallet/') && to.params?.invite_code) {
        // 新格式邀请链接 - 允许访问连接钱包页面
        next()
      } else if (!noLoginRouterList.includes(to.path)) {
        dispatchCustomEvent('event_toastChange', { name: 'Please_access_wallet' })
        next(false)
      } else {
        next()
      }
    } else {
      // 钱包环境 - 自动登录
      const loginSuccess = await performWalletAutoLogin(acountRes, extractedInviteCode)
      
      if (loginSuccess) {
        // 登录成功，跳转到首页
        next({ path: '/', replace: true })
      } else {
        // 登录失败，继续访问原路由
        next()
      }
    }
  }
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
