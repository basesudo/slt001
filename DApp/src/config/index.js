import { storageDict } from './dict'

// 默认配置
export const getMainDomain = (url = location.host) => {
  const parts = url.split('.')
  if (parts.length >= 2) {
    url = parts.slice(-2).join('.')
  }
  return url
}
/**
 * 允许测试平台
 */
export const TEST_PLATFORM = ['dev']
/**
 * 加载配置
 */
const loadAppConfig = () => {
  let domainUrl = getMainDomain()
  window.__config = {
    _BASE_API: import.meta.env.VITE_APP_BASE_API || `https://webapi.${domainUrl}`,
    _BASE_WSS: import.meta.env.VITE_APP_BASE_WSS || `wss://webapi.${domainUrl}`,
    _STATIC_API: import.meta.env.VITE_APP_STATIC_API || `https://static.${domainUrl}`
  }

  for (const key in import.meta.env) {
    if (Object.hasOwnProperty.call(import.meta.env, key) && key.indexOf('VITE') > -1) {
      let tempKey = key.replace('VITE', '')
      window.__config[tempKey] = import.meta.env[key]
    }
  }
  if (TEST_PLATFORM.includes(import.meta.env.VITE_APP_ENV)) {
    // 允许测试平台
    let testPlatformData = localStorage.getItem(storageDict.TEST_PLATFORM)
    console.log(storageDict.TEST_PLATFORM)
    if (testPlatformData) {
      try {
        testPlatformData = JSON.parse(testPlatformData)
        __config._APP_ENV = testPlatformData.platform
        if (testPlatformData.domain) {
          __config._BASE_API = `https://api.${testPlatformData.domain}`
          __config._BASE_WSS = `wss://api.${testPlatformData.domain}`
        }
      } catch (error) {
        localStorage.removeItem(storageDict.TEST_PLATFORM)
      }
    }
  }
  window.__config = __config
  if (__config._USER_NODE_ENV == 'production') {
    Object.freeze(window.__config)
    Object.defineProperty(window, '__config', {
      configurable: false,
      writable: false,
      enumerable: false
    })
  }
}
// 执行加载配置
loadAppConfig()
/**
 * 插入标签
 */
const insertMetaTag = (name, content) => {
  // 创建一个新的 <meta> 元素
  const newMetaElement = document.createElement('meta')
  newMetaElement.setAttribute('name', name)
  newMetaElement.setAttribute('content', content)
  document.head.appendChild(newMetaElement)
}
/**
 * 插入ico
 */
const insertFavicon = (faviconPath) => {
  const linkElement = document.createElement('link')
  linkElement.rel = 'icon'
  linkElement.type = 'image/x-icon'
  linkElement.href = faviconPath
  document.head.appendChild(linkElement)
}
/**
 * 初始化html配置
 */
const initHtml = () => {
  // insertFavicon(`/platform/${__config._APP_ENV}/logo.png`)
  // document.title = __config._APP_META_TITLE
  // // 调用函数插入新的 <meta> 元素
  // insertMetaTag('keywords', __config._APP_META_KEYWORDS)
  // insertMetaTag('description', __config._APP_META_DESCRIPTION)
}
initHtml()

/**
 * 默认语言
 */
export const DEFAULT_LANGUAGE = 'en'

/**
 *  禁止非钱包进入 配置
 */
export const DISABLED_NO_WALLET = ['wirex']

/**
 * 注册邀请码必填 配置(账号，邮箱)
 */
export const REGISTER_REQUIRED_ACTIVECODE = ['bitbyex']
// 手机注册邀请码
export const REGISTER_REQUIRED_ACTIVECODE_MOBILE = []

/**
 * 实名认证 隐藏姓名，证件号码，手持照片
 */
export const REALNAME = ['trustwallet', 'coinmarketcap', 'kabit', 'etfinex', 'ebc', 'gmtoin2']

/**
 * 玩法历史订单分享截图功能
 */
export const HISTORY_SNIPASTE = ['dev', 'coinsexpto']
/**
 * 首页banner和首页币种分开
 */
export const DIFF_HOME_BANNER = ['ebc', 'gemini2', 'fx', 'coinsexpto']
/**
 * 指定接口才展示冻结窗口
 */
export const DIFF_ISFREEZE = ['dev', 'paxpay', 'coinsexpto']

/**
 * 指定接口才展示冻结窗口-其他
 */
export const DIFF_ISFREEZE_OTHER = ['dev', 'coinsexpto']
/**
 * 指定平台1.保存上次提现地址2.不可同时多笔提现
 */
export const DIFF_WITHDRAW = ['hfm2', 'aams']
/**
 * 指定平台1.充值联系客服
 */
export const DIFF_RECHARGE_COSTORM = ['hfm2']
/**
 * 指定平台：隐藏赎回按钮
 */
export const DIFF_HIDE_REDEEM = [
  'gatedefi',
  'math',
  'fx',
  'trustwallet',
  'gmtoin2',
  'ebc',
  'gemini2',
  'etfinex'
]
/**
 * 充值地址使用接口生成的
 */
export const MAKE_ADDRESS = [
  'rxce',
  'gmdoin',
  'gmmoin',
  'gmtoin',
  'coinang',
  'bkfcoin',
  'cmwoin',
  'coinsexpto',
  'gmtoin2',
  'trustwallet',
  'fx',
  'aams'
]
/**
 * 后台锁定/冻结提现资金进入冻结资产
 */
export const DIFF_FREEZE_ASSETS = ['rxce']
/**
 * 推广中心不展示下级信息
 */
export const NO_SHOW_MEMBER = ['bitfly']

/**
 * 12小时制 显示 平台
 */
export const PLATFORM_12HOURFORMAT = ['paxpay', 'trustwallet']


/**
 *  pc配置
 */
export const PLATFORM_PC = ['xxxx']

/**
 * 时区字典
 */
export const TIMEZONE_DICT = [
  { timezone: 'Etc/UTC-12', offset: -12 }, // 对应国际日期变更线
  { timezone: 'Etc/GMT', offset: 0 }, // 对应UTC
  { timezone: 'Pacific/Midway', offset: -11 },
  { timezone: 'Pacific/Honolulu', offset: -10 },
  { timezone: 'Pacific/Marquesas', offset: -9.3 },
  { timezone: 'America/Anchorage', offset: -9 },

  { timezone: 'America/Vancouver', offset: -8 },
  { timezone: 'America/Phoenix', offset: -7 },
  { timezone: 'America/Chicago', offset: -6 },
  { timezone: 'America/New_York', offset: -5 },
  { timezone: 'America/Anguilla', offset: -4 },
  { timezone: 'America/St_Johns', offset: -3.3 },
  { timezone: 'America/Sao_Paulo', offset: -3 },
  { timezone: 'America/Noronha', offset: -2 },
  { timezone: 'America/Scoresbysund', offset: -1 },
  { timezone: 'Europe/London', offset: 1 },
  { timezone: 'Europe/Berlin', offset: 2 },
  { timezone: 'Europe/Moscow', offset: 3 },
  { timezone: 'Asia/Tehran', offset: 3.3 },
  { timezone: 'Asia/Dubai', offset: 4 },
  { timezone: 'Asia/Kabul', offset: 4.3 },
  { timezone: 'Asia/Aqtau', offset: 5 },
  { timezone: 'Asia/Kolkata', offset: 5.3 },
  { timezone: 'Asia/Kathmandu', offset: 5.45 },
  { timezone: 'Asia/Almaty', offset: 6 },
  { timezone: 'Asia/Yangon', offset: 6.3 },
  { timezone: 'Asia/Bangkok', offset: 7 },
  { timezone: 'Asia/Hong_Kong', offset: 8 },
  { timezone: 'Australia/Eucla', offset: 8.45 },
  { timezone: 'Asia/Tokyo', offset: 9 },
  { timezone: 'Australia/Adelaide', offset: 9.3 },
  { timezone: 'Australia/Sydney', offset: 10 },
  { timezone: 'Australia/Lord_Howe', offset: 10.3 },
  { timezone: 'Asia/Magadan', offset: 11 },
  { timezone: 'Pacific/Auckland', offset: 12 },
  { timezone: 'Pacific/Chatham', offset: 12.45 },
  { timezone: 'Pacific/Fakaofo', offset: 13 },
  { timezone: 'Pacific/Kiritimati', offset: 14 }
]
