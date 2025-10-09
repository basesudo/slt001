// 页面公共函数
import router from '@/router/index'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '@/store'
import dayjs from '@/plugin/dayjs/index'
import { customRef, ref } from 'vue'
import { PLATFORM_12HOURFORMAT } from '@/config'
/**
 * 获取配置
 */
export const _getConfig = (key) => {
  let value = ''
  if (key) {
    value = window.__config[key] || ''
  }
  return value
}
/**
 * 页面跳转
 * @param {*} path
 * @param {*} parmas
 */
export const _toView = (path, params = {}) => {
  if (path) {
    router.push(path)
  } else if (params.path || params.name) {
    router.push(params)
  }
}

/**
 * 页面跳转
 * @param {*} path
 */
export const _toReplace = (path) => {
  if (path) {
    router.replace(path)
  }
}
/**
 * 页面后退
 */
export const _back = (num = -1) => {
  if (window.history.length <= 1) {
    _toReplace('/')
  } else {
    router.go(num)
  }
}

/**
 * 多语言 平台定制化
 * @param {*} path
 * @param {*} parmas
 */
export const _t18 = (name, platform = [], i18n = null) => {
  if (!i18n) {
    i18n = useI18n()
  }
  if (platform.includes(__config._APP_ENV)) {
    return i18n.t(`${__config._APP_ENV}_${name}`)
  } else {
    return i18n.t(name)
  }
}

/**
 * 千分位金额格式化
 * @param {*} val
 * @returns
 */
export const _numberWithCommas = (val) => {
  if (!isNaN(Number(val))) {
    const parts = `${val}`.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }
  return val
}

/**
 * 时间格式化
 */
export const _timeFormat = (time, expression = '', flag = false) => {
  const mainStore = useMainStore()
  // console.log('时间', time, mainStore.timezone, mainStore.timeFormat)
  let tempExpression = mainStore.timeFormat
  if (flag) {
    tempExpression = expression || tempExpression
  } else {
    tempExpression = tempExpression + ` ${expression || 'HH:mm:ss'}`
  }
  if (['bitmake'].includes(__config._APP_ENV)) {
    tempExpression = tempExpression.replace('YYYY', 'BBBB')
  }
  if (PLATFORM_12HOURFORMAT.includes(__config._APP_ENV)) {
    tempExpression = tempExpression.replace('HH:mm', 'hh:mm')
    tempExpression += ' a'
  }
  return dayjs(time).tz(mainStore.timezone).format(tempExpression)
}
/**
 * 时间格式化 KLine
 */
export const _klineTimeFormat = (time, expression = '', flag = false) => {
  const mainStore = useMainStore()
  let tempExpression = mainStore.timeFormat
  if (flag) {
    tempExpression = expression || tempExpression
  } else {
    tempExpression = tempExpression + ` ${expression || 'HH:mm:ss'}`
  }
  return dayjs(time).tz('utc').format(tempExpression)
}

/**
 * 隐藏数字
 */
export const _hide = (num) => {
  return '******'
}
/**
 * 隐藏钱包地址中间部分
 */
export const _hideAddress = (str) => {
  let temp = str.toString()
  let subtemp = temp.substring(4, temp.length - 4)
  return temp.replace(subtemp, '*******************')
}
/**
 * 买涨买跌 规则
 * @param {*} open 开盘价
 * @param {*} close 关盘价
 * @param {*} direction 方向 buy 买(默认) sell 卖
 * @param {*} default 默认
 * @returns rise 涨 fall 跌 draw 平
 */
export const _isRFD = (open, close, direction = 'buy', def = 'draw') => {
  let tempVal = ''
  open = Number(open)
  close = Number(close)
  if (isNaN(open) || isNaN(close)) {
    return 'draw'
  }
  if (open < close) {
    // buy 涨 sell 跌D
    if (direction == 'buy') {
      tempVal = 'rise'
    } else if (direction == 'sell') {
      tempVal = 'fall'
    }
  } else if (open > close) {
    // buy 跌 sell 涨
    if (direction == 'buy') {
      tempVal = 'fall'
    } else if (direction == 'sell') {
      tempVal = 'rise'
    }
  } else if (open == close) {
    // buy sell 平
    tempVal = def
  }

  return tempVal
}

/**
 * 涨跌 规则
 * @param {*} price 价格
 * @param {*} direction 方向 buy 买(默认) sell 卖
 * @param {*} default 默认
 * @returns rise 涨 fall 跌 draw 平
 */
export const _isRFDE = (price, direction = 'buy', def = 'draw') => {
  let tempVal = ''
  price = Number(price)
  if (0 < price) {
    // buy 涨 sell 跌D
    if (direction == 'buy') {
      tempVal = 'rise'
    } else if (direction == 'sell') {
      tempVal = 'fall'
    }
  } else if (0 > price) {
    // buy 跌 sell 涨
    if (direction == 'buy') {
      tempVal = 'fall'
    } else if (direction == 'sell') {
      tempVal = 'rise'
    }
  } else if (0 == price) {
    // buy sell 平
    tempVal = def
  }

  return tempVal
}

/**
 * 数据处理1
 *  usdt->usdt
 *  btc->btcusdt
 */
export const filterCoin = (item) => {
  item = item.toLocaleLowerCase()
  if (item == 'usdt') {
    return item
  } else {
    return item + 'usdt'
  }
}
/**
 * 数据处理2
 *  usdt->usdt
 *  btcusdt->btc
 */
export const filterCoin2 = (item) => {
  item = item.toLocaleLowerCase()
  if (item == 'usdt') {
    return item
  } else {
    return item.replace('usdt', '').trim()
  }
}
/**
 * 充值币种处理
 * rechargeBtc->BTC
 * rechargeUsdtTrc->USDT-TRC
 */
export const filterRechargeToAddress = (item) => {
  item = item.toLocaleLowerCase()
  if (item.includes('rechargeusdt')) {
    return item.replace('rechargeusdt', 'usdt-').trim().toLocaleUpperCase()
  } else if (item.includes('recharge')) {
    return item.replace('recharge', '').trim().toLocaleUpperCase()
  } else {
    return item.toLocaleUpperCase()
  }
}

/**
 * 防抖
 * @param {*} value
 * @param {*} duratinon
 * @returns
 */
export const debounceRef = (value, duratinon = 1000) => {
  let timer
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(val) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = val
          trigger()
        }, duratinon)
      }
    }
  })
}

/**
 * 节流
 * @param {*} value
 * @param {*} duratinon
 * @returns
 */
export const throttleRef = (value, duratinon = 300) => {
  let timer
  return duratinon == null
    ? ref(value)
    : customRef((track, trigger) => {
        return {
          get() {
            track()
            return value
          },
          set(val) {
            if (timer == null) {
              timer = setTimeout(() => {
                // 修改数据
                value = val
                // 派发更新
                trigger()
                // 清除定时器
                clearTimeout(timer)
                timer = null
              }, duratinon)
            }
          }
        }
      })
}
