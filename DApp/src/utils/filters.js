import days from '@/plugin/dayjs'
import { _sub, _mul, _toFixed } from '@/utils/decimal'
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store'
/**
 *
 * @param {*} type 1 指定天数 2 每日结算 3 产品到期结算
 * @param {*} day 期限
 * @param {*} creatime 创建时间
 * @returns 过滤我的投资中的到账时间
 */
export const timeOfreceipt = (type, day, creatime) => {
  switch (type) {
    case 1:
      return days(new Date())
        .add(day ? day : 0, 'day')
        .format('DD/MM/YYYY')
    case 2:
      // 每日结算
      return _t18(`daily_settlement`)
    case 3:
      const mainStore = useMainStore()
      return days(creatime)
        .add(day ? day : 0, 'day')
        .tz(mainStore.timezone)
        .format('DD/MM/YYYY HH:mm:ss')
    default:
      break
  }
}

/**
 *
 * @param {*} type 0 收益 1 结算 2 赎回
 * @returns 过滤我的投资中的状态
 */
export const investmentStatus = (type) => {
  switch (type) {
    case 0:
      // 持仓中
      return {
        color: '#2654FF',
        name: _t18(`In_position`)
      }
    case 1:
      // 已结算
      return {
        color: '#838B9C',
        name: _t18(`Settled`)
      }
    case 2:
      // 已赎回
      return {
        color: '#17AC74',
        name: _t18(`host_redeemed`)
      }

    default:
      break
  }
}
/**
 *
 * @param {*} list 传入数组
 * @param {*} key  传入需要转的name
 * @returns 按照字母a-z写顺序
 */
export const letterSmallToLarge = (list, key) => {
  let array = list.slice().sort((a, b) => {
    return a[key].toLowerCase().localeCompare(b[key].toLowerCase())
  })
  return array
}
/**
 *
 * @param {*} list 传入数组
 * @param {*} key  传入需要转的name
 * @returns 按照字母z-a写顺序
 */
export const letterLargeToSmall = (list, key) => {
  let array = list.slice().sort((a, b) => {
    return b[key].toLowerCase().localeCompare(a[key].toLowerCase())
  })
  return array
}
/**
 *
 * @param {*} list 当前数组
 * @param {*} obj 币种对象
 * @returns 最新价大到小
 */
import { _isRFD } from '@/utils/public'
export const LatestpriceLargeToSmall = (list, obj, type, isRise = 0) => {
  if (!isRise) {
    var newList = list.map(function (item) {
      return { ...item, latestPrice: obj[item.coin][type] ? Number(obj[item.coin][type]) : 0 }
    })
  } else {
    list.forEach((item) => {
      switch (_isRFD(obj[item.coin]?.open, obj[item.coin]?.close)) {
        case 'rise':
          item.latestPrice = Number(obj[item.coin][type])
          break
        case 'fall':
          item.latestPrice = -Number(obj[item.coin][type])
          break
        default:
          item.latestPrice = Number(obj[item.coin][type])
      }
    })
    var newList = list
  }

  var newArr = newList.slice(0).sort(function (a, b) {
    return a.latestPrice - b.latestPrice
  })

  console.log(newArr)
  return newArr
}
/**
 *
 * @param {*} list 当前数组
 * @param {*} obj 币种对象
 * @returns 最新价小到大
 */
export const LatestpriceSmallToLarge = (list, obj, type, isRise = 0) => {
  if (!isRise) {
    var newList = list.map(function (item) {
      return { ...item, latestPrice: obj[item.coin][type] ? Number(obj[item.coin][type]) : 0 }
    })
  } else {
    list.forEach((item) => {
      switch (_isRFD(obj[item.coin]?.open, obj[item.coin]?.close)) {
        case 'rise':
          item.latestPrice = Number(obj[item.coin][type])
          break
        case 'fall':
          item.latestPrice = -Number(obj[item.coin][type])
          break
        default:
          item.latestPrice = Number(obj[item.coin][type])
      }
    })
    var newList = list
  }
  var newArr = newList.slice(0).sort(function (a, b) {
    return b.latestPrice - a.latestPrice
  })
  return newArr
}
/**
 *
 * @param {*} list
 * @param {*} value
 * @returns 过滤搜索币种
 */
export const filterKeyWord = (list, value) => {
  var newArr = list.filter(function (obj) {
    if (obj.customizeFlag === 2) {
      return obj.showSymbol.indexOf(value.toUpperCase()) !== -1
    } else {
      return obj.coin.indexOf(value.toLowerCase()) !== -1
    }
  })
  return newArr
}
//过滤币种
/**
 *
 * @param {*} arr 原数组
 * @param {*} str 过滤字符
 * @param {*} key 标识(key==2,与coin比较；否则与showSymbol比较)
 * @returns 过滤币种
 */
export const filterKeyCoin = (arr, str, key) => {
  let arr2 = []
  if (str.length) {
    if (key == 2) {
      arr2 = arr.filter((item, index) => {
        return item.coin.indexOf(str.toLowerCase()) !== -1
      })
    } else {
      arr2 = arr.filter((item, index) => {
        return item.showSymbol.indexOf(str.toUpperCase()) !== -1
      })
    }
  } else {
    arr2 = arr
  }
  return arr2
}
/**
 *
 * @param {*} num 数字
 * @returns 倒计时 00:00
 */
export const countdownNum = (num) => {
  num = Math.round(Number(num))
  const minutes = Math.floor(num / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (num % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
/**
 *
 * @param {*} num
 * @returns 倒计时 00:00:00
 */
export const formatTime = (num) => {
  num = Math.round(Number(num))
  const hours = Math.floor(num / 3600)
  const minutes = Math.floor((num - hours * 3600) / 60)
  const seconds = num - hours * 3600 - minutes * 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}
/**
 *
 * @param {*} historyList  //数组
 * @param {*} coin  当前币名称
 * @returns 过滤当前币种
 */
export const formatCurrentcurrency = (historyList, coin) => {
  let listArray = []
  if (historyList.length > 0) {
    historyList.forEach((item) => {
      if (item.symbol === coin) {
        listArray.push(item)
      }
    })
    return listArray
  } else {
    return historyList
  }
}

/**
 * 
 * @param {*} flag 看涨/看跌
 * @param {*} buyPrice 买的时候的价钱
 * @param {*} latestPrice 最新的价钱
 * @param {*} quantity 买的数量
 * @param {*} odds 利率
 * @returns 计算看涨/看跌的预计盈利
 * 
 * 看涨  openPrice  > close  - quantity * cycleObj.odds   
openPrice  < close  + quantity * cycleObj.odds   
看跌 openPrice  > close    + quantity * cycleObj.odd
看跌 openPrice  < close    -quantity * cycleObj.odd
 */
export const formatExpectedProfit = (flag, buyPrice, latestPrice, quantity, odds, rateFlag) => {
  buyPrice = Number(buyPrice)
  latestPrice = Number(latestPrice)
  quantity = Number(quantity)
  const price = _mul(quantity, odds)
  if (rateFlag) {
    if (flag) {
      if (buyPrice > latestPrice) {
        return '-' + quantity
      }
      if (buyPrice === latestPrice) {
        return '0.00'
      }
      if (buyPrice < latestPrice) {
        return '+' + price
      }
    } else {
      if (buyPrice > latestPrice) {
        return '+' + price
      }
      if (buyPrice === latestPrice) {
        return '0.00'
      }
      if (buyPrice < latestPrice) {
        return '-' + quantity
      }
    }
  } else {
    if (flag) {
      if (buyPrice > latestPrice) {
        return '-' + price
      }
      if (buyPrice === latestPrice) {
        return '0.00'
      }
      if (buyPrice < latestPrice) {
        return '+' + price
      }
    } else {
      if (buyPrice > latestPrice) {
        return '+' + price
      }
      if (buyPrice === latestPrice) {
        return '0.00'
      }
      if (buyPrice < latestPrice) {
        return '-' + price
      }
    }
  }
}
//hightDown 红色 hightUp 蓝色
/**
 *
 * @param {*} flag 看涨/看跌
 * @param {*} buyPrice 买的时候的价钱
 * @param {*} latestPrice 最新的价钱
 * @returns 计算看涨/看跌的预计盈利的颜色hightDown 红色 hightUp 蓝色
 */
export const formatExpectedProfitColor = (flag, buyPrice, latestPrice) => {
  buyPrice = Number(buyPrice)
  latestPrice = Number(latestPrice)
  if (flag) {
    if (buyPrice > latestPrice) {
      return 'hightDown'
    }
    if (buyPrice === latestPrice) {
      return ''
    }
    if (buyPrice < latestPrice) {
      return 'hightUp'
    }
  } else {
    if (buyPrice > latestPrice) {
      return 'hightUp'
    }
    if (buyPrice === latestPrice) {
      return ''
    }
    if (buyPrice < latestPrice) {
      return 'hightDown'
    }
  }
}

// 历史委托中的盈亏
// betAmount > rewardAmount    -(betAmount - rewardAmount)
// betAmount = rewardAmount    0.00
// betAmount < rewardAmount   + (rewardAmount - betAmount)
export const profitAndloss = (betAmount, rewardAmount) => {
  if (betAmount > rewardAmount) {
    return '-' + _sub(betAmount, rewardAmount)
  }
  if (betAmount === rewardAmount) {
    return 0
  }
  if (betAmount < rewardAmount) {
    return '+' + _sub(rewardAmount, betAmount)
  }
}
// 历史委托中的盈亏颜色
export const profitAndlossColor = (betAmount, rewardAmount) => {
  if (betAmount > rewardAmount) {
    return 'hightDown'
  }
  if (betAmount === rewardAmount) {
    return ''
  }
  if (betAmount < rewardAmount) {
    return 'hightUp'
  }
}

//截取某一个前面的
export const matchText = (value, matchVal) => {
  if (matchVal) {
    const index = value.indexOf(matchVal)
    const result = value.substring(0, index)
    return result
  } else {
    return value
  }
}
