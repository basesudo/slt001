import '@/assets/main.scss'
import 'vant/es/toast/style'
import 'vant/lib/index.css'
import 'lib-flexible'
import 'animate.css'
import BreathingColors from 'vue-breathing-colors'
import { createApp } from 'vue'
import _ from 'lodash'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import { setupI18n } from './plugin/i18n/index'
import * as publicFun from '@/utils/public'
import { useTradeStore } from '@/store/trade/index'
import { useMainStore } from '@/store/index.js'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { _initCoinWebSocket } from '@/plugin/socket/index.js'
import { initSwitchWalletEvent } from './plugin/chain'
import { storageDict } from './config/dict'
import { setToastDefaultOptions, showDialog } from 'vant'
// 加载主题
import { initTheme, switchPlanform } from './utils/index'

initTheme()

/**
 * 切换平台 pc、h5
 */
switchPlanform(true)
window.addEventListener(
  'resize',
  _.debounce(function () {
    switchPlanform()
  }, 150)
)
// 设置默认参数
setToastDefaultOptions({ duration: 1500 })
setToastDefaultOptions('loading', { forbidClick: true })
/**
 * 初始化socket
 */
_initCoinWebSocket()
const app = createApp(App)
// 状态管理
const pinia = createPinia()
// 持久化
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(BreathingColors)
// 获取币种列表
const tradeStore = useTradeStore()
const mainStore = useMainStore()

// 获取平台地址 获取平台配置 币种列表 语言列表
Promise.all([
  mainStore.getPlatFormConfig(),
  mainStore.getSettingConfig(),
  tradeStore.getCoinList(),
  // mainStore.getLanguageList()
]).then(async () => {
  const currentLanguage = mainStore.languageList.filter((item) => item.isDefault === 'Y')
  // 判断语言列表中是否存在缓存语言 若不存在 使用默认语言
  let defaultLanguage = mainStore.language || ''
  if (!defaultLanguage && currentLanguage.length) {
    defaultLanguage = currentLanguage[0].dictValue
  }
  const i18n = await setupI18n(defaultLanguage)
  app.use(i18n)
  app.mount('#app')
})

// 页面公共函数
for (const key in publicFun) {
  if (Object.hasOwnProperty.call(publicFun, key)) {
    const elem = publicFun[key]
    app.config.globalProperties[key] = elem
  }
}

// 钱包监听 - 使用新的监听器
import { initWalletMonitor } from '@/utils/walletMonitor'
initWalletMonitor()

// 禁止双指缩放的 JavaScript 代码
document.documentElement.addEventListener(
  'touchstart',
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  },
  { passive: false }
)

if (process.env.NODE_ENV == 'production ') {
  // 阻止上下文菜单（右键单击）的显示
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault()
  })

  // 阻止某些键盘组合键（Ctrl/Command 键）的默认行为
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
    }
  })
}

// 阻止在触摸设备上进行双击缩放
document.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault()
  }
})

// 阻止手势事件的默认行为（例如，捏合缩放）
document.addEventListener('gesturestart', function (event) {
  event.preventDefault()
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState == 'hidden') {
    //页面隐藏
    localStorage.setItem(storageDict.CLOSE_WINDOW_TIME, +new Date())
  } else {
    // 页面显示
    let visibleTime = +new Date()
    let hiddenTime = localStorage.getItem(storageDict.CLOSE_WINDOW_TIME) || visibleTime
    //页面再次可见时间-隐藏时间>60s,重连 >5min,刷新页面
    let diffTime = (visibleTime - hiddenTime) / 1000
    console.log('页面再次可见时间', diffTime)
    if (diffTime > 5 * 60) {
      setTimeout(() => location.reload(), 10)
    }
  }
})
