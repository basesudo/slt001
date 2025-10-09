import { PLATFORM_PC } from '@/config/index.js'
import { _div, _sub, _add, _mul, _toFixed } from './decimal.js'
import { storageDict } from '../config/dict'

/**
 * 函数sleep，参数单位 毫秒
 */
export const wait = (ms) => {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}
/**
 * 自定义 事件触发
 * @param name
 * @param data
 */
export const dispatchCustomEvent = (name, data) => {
  document.dispatchEvent(
    new CustomEvent(name, {
      detail: data
    })
  )
}

/**
 * 监听pc h5
 */
export const switchPlanform = (initFlag = false) => {
  if (import.meta.env.DEV) {
    return
  }
  let isMobile = !!window.navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  const { _APP_PLANFORM_H5, _APP_PLANFORM_PC } = __config
  let h5Path = ''
  let pcPath = ''
  if (_APP_PLANFORM_H5 != undefined) {
    h5Path = _APP_PLANFORM_H5 || `http://${location.host}`
  }
  if (_APP_PLANFORM_PC != undefined) {
    pcPath = _APP_PLANFORM_PC || `http://pc.${location.host}`
  }

  if (h5Path && pcPath) {
    if (initFlag) {
      // 初始化检测
      if (isMobile || window.innerWidth < 690) {
        if (location.origin != h5Path) {
          window.location.replace(h5Path)
        }
      } else {
        if (location.origin != pcPath) {
          window.location.replace(pcPath)
        }
      }
    } else if (PLATFORM_PC.includes(__config._APP_ENV)) {
      // pc平台检测
      if (isMobile || window.innerWidth < 690) {
        if (location.origin != h5Path) {
          window.location.replace(h5Path)
        }
      } else if (!isMobile || window.innerWidth > 690) {
        if (location.origin != pcPath) {
          window.location.replace(pcPath)
        }
      }
    } else if (!isMobile) {
      // 非手机
      if (location.origin == h5Path) {
        window.location.replace(h5Path)
      }
    }
  }
}

/**
 * 初始化主题
 */
export const initTheme = () => {
  let theme = __config._APP_PLEATFORM_THEME || 'light'
  // 设置主题
  setTheme(theme)
}

/**
 * 设置主题
 */
export const setTheme = (theme) => {
  if (theme && theme != window?.__theme) {
    window.__theme = theme
    document.body.setAttribute('theme', theme)
    localStorage.setItem(storageDict.THEME, theme)
    // setTimeout(() => location.reload(), 10)
  }
}

/**
 * 判断浏览器函数
 */
export const isMobile = () => {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true // 移动端
  } else {
    return false // PC端
  }
}
/**
 * 获取当前平台
 */
export const getPlatform = () => {
  var u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    //android终端
    return 'Android'
  } else if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    //ios终端
    return 'IOS'
  } else {
    // PC
    return 'Browser'
  }
}

/**
 * 判断defi钱包
 */
export const getDeFiWallet = () => {
  for (let key in window) {
    if (['deficonnect', 'DeFiConnectAptosProvider'].indexOf(key) > -1) {
      return true
    }
  }
  return false
}
/**
 * 随机生成数字+字母
 * @param {Number} num
 * @returns
 */
export const randomString = (num) => {
  let str = ''
  let randomchar = function () {
    let n = Math.floor(Math.random() * 20)
    if (n < 10) return n //1-10
    // if (n < 20) String.fromCharCode(Math.round(Math.random() * 25) + 65) //A-Z
    return String.fromCharCode(Math.round(Math.random() * 25) + 97) //a-z
  }
  while (str.length < num) str += randomchar()
  return str
}
/**
 * 随机生成数字
 * @param {Number} num
 * @returns
 */
export const randomNumber = (num) => {
  let str = ''
  while (str.length < num) str += Math.floor(Math.random() * 10)

  return str
}
