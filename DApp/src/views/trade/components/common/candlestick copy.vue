<script setup>
import { getKlineHistory } from '@/api/common/kline.js'
import Datafees from '@/config/kline/datafees.js'
import { getConfig, getIntervalList, getStudyList } from '@/config/kline/index.js'
import { _coinWebSocket } from '@/plugin/socket/index'
import { _t18, _klineTimeFormat } from '@/utils/public'
import { socketDict } from '@/config/dict'
import PubSub from 'pubsub-js'
import { _add, _div, _mul, priceFormat } from '@/utils/decimal'
import _ from 'lodash'
import { computed } from 'vue'
import { useMainStore } from '@/store'
import { useTradeStore } from '@/store/trade'
import { debounce, throttle } from 'lodash'

const props = defineProps({
  /**
   * 类型
   */
  type: {
    type: String,
    default: 'detail'
  },

  /**
   * 商品信息
   */
  coinInfo: {
    type: Object,
    default: () => {}
  }
})
/**
 * 分辨率
 */
const priceScale = computed(() => {
  let tempPricescale = 10000
  if (props.coinInfo?.amount > 100) {
    tempPricescale = 100
  } else if (props.coinInfo?.amount < 0.1) {
    tempPricescale = 1000000
  } else if (props.coinInfo?.amount < 100) {
    tempPricescale = 10000
  }
  return tempPricescale
})
/**
 * 临时交易
 */
const tempTrade = {
  time: '',
  amount: '',
  open: '',
  high: '',
  low: '',
  close: '',
  volume: '',
  lastClose: '',
  intervention: false
}
/**
 * 分辨率差
 */
const intervalDiff = ref('')
/**
 * 总分辨率列表
 */
const intervalList = getIntervalList()
/**
 * 指标列表
 */
const studyList = getStudyList()

const headIntervalList = reactive([])
const menuIntervalList = intervalList.filter((elem) => elem?.isMore)

/**
 * K线使用 分辨率列表
 */
let supportedResolutions = []
/**
 * 数据sdk实例
 */
let datafeeds = null
// 指标
let studies = reactive([])

/**
 * 当前symbol 切换时过渡
 */
let currentCoinInfo = reactive({})
/**
 * 当前interval 切换时过渡
 */
let currentInterval = reactive({})

/**
 * KLine
 */
const klineId = computed(() => `kline_${props.type}`)

let widget = null
const mainStore = useMainStore()
const tradeStore = useTradeStore()

/**
 * 交易对监听
 */
const eventTradeSymbolChange = debounce((e) => {
  // 监听币种切换
  let symbol = e.detail.symbol
  let tempCoinInfo = e.detail.coinInfo
  // 分辨率改变
  let tempHeadIntervalList = getHeadIntervalList(tempCoinInfo)

  if (
    tempHeadIntervalList.map((elem) => elem.value).join() !=
    headIntervalList.map((elem) => elem.value).join()
  ) {
    // 判断分辨率是否一致
    supportedResolutions = getSupportedResolutions()
    headIntervalList.splice(0, headIntervalList.length, ...tempHeadIntervalList)
    Object.assign(currentInterval, headIntervalList[0])
  }
  showMenu.value = false
  // 设置币种
  setSymbol(symbol, currentInterval.interval, () => {
    Object.assign(currentCoinInfo, props.coinInfo)
  })
}, 200)
/**
 * 获取分辨率
 */
const getSupportedResolutions = (tempCoinInfo = currentCoinInfo) => {
  let tempList = intervalList.map((elem) => elem.interval)
  if (tempCoinInfo?.market == 'mt5') {
    tempList = intervalList.filter((elem) => elem.market == 'mt5').map((elem) => elem.interval)
  }
  return tempList
}
/**
 * 获取分辨率显示菜单
 */
const getHeadIntervalList = (tempCoinInfo = currentCoinInfo) => {
  let tempList = intervalList.filter((elem) => !elem?.isMore)
  if (tempCoinInfo?.market == 'mt5' || tempCoinInfo?.coinType === 3) {
    tempList = intervalList.filter((elem) => elem.market == 'mt5')
  }
  return tempList
}
onMounted(async () => {
  Object.assign(currentCoinInfo, props.coinInfo)
  supportedResolutions = getSupportedResolutions()
  headIntervalList.splice(0, headIntervalList.length, ...getHeadIntervalList())
  Object.assign(currentInterval, headIntervalList[0])
  document.addEventListener('event_tradeSymbolChange', eventTradeSymbolChange)
  nextTick(() => {
    initWidget()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('event_tradeSymbolChange', eventTradeSymbolChange)
  unsubscribeTrades(true)
  widget.remove()
})

/**
 * 设置币种、周期
 */
const setSymbol = async (symbol, interval, callBack) => {
  if (currentCoinInfo.symbol != symbol || interval != currentInterval.interval) {
    widget?.setSymbol(symbol, interval, () => {
      console.log('------setSymbol---------', props.coinInfo.symbol, interval)
      Object.assign(
        currentInterval,
        intervalList.find((elem) => elem.interval == interval)
      )
      callBack && callBack()
    })
  }
}

// 数据实例
const dataFeedInstance = {}
/**
 * 获取配置
 */
dataFeedInstance.getConfig = async (callback) => {
  setTimeout(() => {
    callback({
      // 分辨率
      supported_resolutions: supportedResolutions,
      supports_marks: false,
      supports_timescale_marks: true,
      supports_time: true
    })
  }, 0)
}
/**
 * 获取服务器时间
 */
dataFeedInstance.getServerTime = async (callback) => {
  let time = +new Date()
  callback && callback(time)
}
/**
 * 获取历史KLine数据
 */
dataFeedInstance.getBars = async ({ symbolInfo: coinInfo, resolution, from, firstDataRequest }) => {
  let tempInterval = intervalList.find((elem) => elem.interval == resolution)
  try {
    if (tempInterval && (from == '' || from > 0)) {
      let params = {
        symbol: coinInfo.coinUpperCase,
        interval: tempInterval.key,
        limit: 1000
      }
      if (from) {
        params.end = from
      }
      // let barList = await client.candles(params)
      const { data } = await getKlineHistory({
        ...params,
        interval: tempInterval.key,
        symbol: coinInfo.coinUpperCase,
        market: coinInfo.market
      })
      /* tradeStore.setKlineTicker(data.ticker)
      let barList = data.historyKline */
      let barList = []
      if (data) {
        tradeStore.setKlineTicker(data.ticker)
        barList = data.historyKline
      }
      barList = barList
        .map((elem) => {
          return {
            open: parseFloat(elem.o),
            high: parseFloat(elem.h),
            low: parseFloat(elem.l),
            close: parseFloat(priceFormat(elem.c)),
            amount: parseFloat(priceFormat(elem.c)),
            volume: parseFloat(elem.v),
            time: elem.T
          }
        })
        .sort((a, b) => a.time - b.time)
      if (firstDataRequest) {
        let tempObj = barList.slice(-1)[0]

        tempTrade.amount = tempObj.amount
        tempTrade.open = tempObj.open
        tempTrade.close = tempObj.close
        tempTrade.high = tempObj.high
        tempTrade.low = tempObj.low
        tempTrade.volume = tempObj.volume
        tempTrade.time = tempObj.time
        tempTrade.lastClose = tempObj.close
        tempTrade.intervention = false

        intervalDiff.value = Math.abs(tempTrade.time - barList.slice(-2, -1)[0].time)
        console.log('初始', tempTrade.lastClose, intervalDiff.value)
        updateDataKline(tempTrade)
        subscribeTrades({
          coin: coinInfo.coin,
          symbol: coinInfo.symbol,
          interval: tempInterval.key,
          firstDataRequest: firstDataRequest
        })
      }
      return barList
    }
  } catch (error) {
    unsubscribeTrades(true)
    return []
  }
  return []
}

/**
 * 加载商品配置
 */
dataFeedInstance.resolveSymbol = async () => {
  return {
    // 商品名称
    name: props.coinInfo.symbolUpperCase,
    // 自定义携带参数
    coin: props.coinInfo.coin,
    coinUpperCase: props.coinInfo.coin,
    symbol: props.coinInfo.symbol,
    symbolUpperCase: props.coinInfo.symbolUpperCase,
    market: props.coinInfo.market,
    // resolution: '1m',
    fractional: false,
    //设置周期
    session: '24x7',
    // 显示商品是否具有历史数据
    has_intraday: true,
    //设置是否支持周月线
    has_weekly_and_monthly: true,
    // 布尔值显示商品是否具有以日为单位的历史数据
    // has_daily: true,
    // 交易所名称
    exchange: __config._APP_EXCHANGE_NAME,
    //设置是否支持周月线
    description: props.coinInfo.symbolUpperCase,
    //设置价格精度  100表示保留两位小数   1000三位   10000四位
    pricescale: priceScale.value,
    // 最小波动
    minmov: 1 / priceScale.value,
    // 分辨率数组
    supported_resolutions: supportedResolutions
  }
}

/**
 * 初始化图表
 */
const initWidget = () => {
  datafeeds = new Datafees(dataFeedInstance)
  // 主题
  let theme = window.__theme
  widget = new TradingView.widget({
    symbol: props.coinInfo.symbolUpperCase,
    theme,
    debug: false,
    autosize: true,
    // 默认分辨率
    interval: currentInterval.interval,
    container_id: klineId.value,
    datafeed: datafeeds,
    library_path: '/charting_library/',
    custom_css_url: `../tradingview_${theme}.css`,
    locale: 'en',

    timezone: mainStore.timezone,
    // 自定义日期格式化
    customFormatters: {
      dateFormatter: {
        format(date) {
          return _klineTimeFormat(date.getTime(), 'DD/MM/YYYY', true)
        }
      },
      timeFormatter: {
        format(date) {
          return _klineTimeFormat(date.getTime(), 'HH:mm:ss', true)
        }
      }
    },

    preset: 'mobile',
    ...getConfig(theme)
  })
  widget.onChartReady(() => {
    createStudy()
  })
}

/**
 * 创建指标
 */
const createStudy = () => {
  // let id = widget.chart().createStudy('volume', false, false, [5], null)
  // studies.push(id)
  let id = setStudy(studyList[0].name)
  studies.push(id)
}
/**
 * 订阅客户端列表
 */
const subscribeClientList = []
/**
 * 取消订阅
 * @param {*} firstDataRequest
 */
const unsubscribeTrades = (firstDataRequest = false) => {
  if (currentCoinInfo.coin) {
    _coinWebSocket.send({
      op: socketDict.unsubscribe,
      type: socketDict.KLINE,
      symbol: currentCoinInfo.coin,
      interval: currentInterval.key
    })
    if (firstDataRequest) {
      subscribeClientList.forEach((subKey) => {
        subKey && PubSub.unsubscribe(subKey)
      })
      subscribeClientList.length = 0
      _coinWebSocket.send({
        op: socketDict.unsubscribe,
        type: socketDict.TRADE,
        symbol: currentCoinInfo.coin
      })
    }
  }
}

/**
 * 订阅实时成交
 */
const subscribeTrades = async (params) => {
  // 先取消订阅
  unsubscribeTrades(params.firstDataRequest)

  _coinWebSocket.send({
    op: socketDict.subscribe,
    type: socketDict.KLINE,
    symbol: params.coin,
    interval: params.interval
  })

  if (params.firstDataRequest) {
    _coinWebSocket.send({
      op: socketDict.subscribe,
      type: socketDict.TRADE,
      symbol: params.coin
    })
  }
  // let marketTradeKey = PubSub.subscribe(socketDict.TRADE, (key, data) => {
  // // 实时成交
  // if (data.symbol == params.coin) {
  //   let tempData = data.data.tick.data[0]
  //   // console.log('实时成交', data.symbol, tempData)
  //   if (
  //     tempTrade.time <= tempData.ts &&
  //     priceFormat(tempTrade.close) != priceFormat(tempData.price)
  //   ) {
  //     if (tempTrade.high < tempData.price) {
  //       tempTrade.high = tempData.price
  //     } else if (tempTrade.low > tempData.price) {
  //       tempTrade.low = tempData.price
  //     }
  //     tempTrade.close = Number(priceFormat(tempData.price))
  //     // updateDataKlineThrottle(tempTrade)
  //     updateDataKline(tempTrade)
  //   }
  // }
  // })
  // subscribeClientList.push(marketTradeKey)
  let candlestickKey = PubSub.subscribe(socketDict.KLINE, (key, data) => {
    // K线数据
    // console.log('K线数据', tempTrade.lastClose, intervalDiff.value, data.data.tick)
    let tempData = data.data.tick
    if (data.symbol == params.coin) {
      if (tempTrade.intervention != tempData?.intervention) {
        // console.log('干预', tempTrade.intervention, tempData?.intervention, tempTrade.lastClose)
        tempData.open = tempTrade.lastClose
        tempTrade.intervention = tempData?.intervention
      }
      // 本次时间
      let tempTime = parseInt(tempData.id / intervalDiff.value) * intervalDiff.value
      if (tempTrade.time < tempTime) {
        // console.log('本次时间', tempData.open, tempTrade.time, tempTime, tempData)
        tempTrade.time = tempTime
        tempTrade.open = tempData.open
      }
      tempTrade.high = tempData.high
      tempTrade.low = tempData.low
      tempTrade.close = Number(priceFormat(tempData.close))
      tempTrade.volume = tempData.vol
      updateDataKline(tempTrade)
    }
  })
  subscribeClientList.push(candlestickKey)
}
/**
 * 更新数据
 */
const updateDataKline = (newData) => {
  if (newData?.close) {
    // console.log('更新数据', newData)
    datafeeds.updateData(newData)
    PubSub.publish(socketDict.DETAIL, {
      data: {
        ...newData,
        vol: newData.volume
      },
      origin: 'kline',
      symbol: currentCoinInfo.coin,
      type: socketDict.DETAIL
    })
  }
}
/**
 * 更新数据 限流
 */
const updateDataKlineThrottle = throttle(function (newData) {
  updateDataKline(newData)
}, 300)
/**
 * 显示更多分辨率
 */
const showMenu = ref(false)
/**
 * 选中分辨率
 * @param {*}
 */
const checkedInterval = (item, type = '') => {
  if (item.interval != currentInterval.interval) {
    setSymbol(props.coinInfo.symbol, item.interval)
  }
  showMenu.value = !!type
}

// 指标选择
const currentStudy = ref('')
/**
 * 设置指标
 */
const setStudy = (name) => {
  if (currentStudy.value == name) {
    return
  }
  const activeChart = widget.activeChart()
  // 关闭旧指标
  if (currentStudy.value) {
    let oldStudy = studyList.filter((elem) => elem.name == currentStudy.value)[0]
    oldStudy.list.forEach((elem) => {
      activeChart.removeEntity(elem)
    })
  }
  // 设置新指标
  currentStudy.value = name
  let newStudy = studyList.filter((elem) => elem.name == currentStudy.value)[0]
  let tempList = []
  newStudy.cycleList.forEach(async (cycle, index) => {
    let result = ''
    if (name == 'MACD') {
      result = await activeChart.createStudy(currentStudy.value, false, false, [], {})
    } else if (name == 'Bollinger Bands') {
      result = await activeChart.createStudy(currentStudy.value, false, false, [], {})
    } else {
      result = await activeChart.createStudy(currentStudy.value, false, false, [cycle], {
        'plot.color': newStudy.colorList[index],
        'plot.linewidth': 2
      })
    }
    tempList.push(result)
  })
  newStudy.list = tempList
}
</script>
<template>
  <div>
    <div class="third">
      <div class="list">
        <div class="thirdLeft">
          <div
            :class="{
              'hightItem item ff-num': item.interval === currentInterval.interval,
              'item ff-num': true
            }"
            v-for="(item, index) in headIntervalList"
            :key="index"
            @click="checkedInterval(item)"
          >
            {{ item.value }}
          </div>
        </div>
        <!-- 更多 -->
        <!-- <div
          class="thirdRight"
          v-show="currentCoinInfo.market != 'mt5'"
          @click="showMenu = !showMenu"
        >
          
          <div>{{ _t18(`exchange_more`) }}</div>
          <svg-load v-if="!showMenu" name="jiantou-x" class="thirdRightImg"></svg-load>
          <svg-load v-if="showMenu" name="jiantou-s" class="thirdRightImg"></svg-load>
        </div> -->
      </div>
    </div>
    <div
      class="selectTimes"
      v-if="showMenu"
      @touchmove.prevent
      @mousewheel.prevent
      @click="showMenu = false"
    >
      <div class="times">
        <div
          v-for="(item, index) in menuIntervalList"
          :key="index"
          :class="{ hightItem: item.interval === currentInterval.interval, 'item ff-num': true }"
          @click="checkedInterval(item, 'menu')"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
  <div :id="klineId" class="candlestick"></div>
  <div class="studyList">
    <div
      :class="item.name === currentStudy ? 'hightItem studyItem' : 'studyItem'"
      v-for="(item, index) in studyList"
      :key="index"
      @click="setStudy(item.name)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.candlestick {
  height: 348px;
  background-color: var(--ex-candlestick-bg);
}
.hightItem {
  color: var(--ex-font-color9) !important;
}
.third {
  margin-top: 10px;
  padding: 0px 15px 10px;
  border-bottom: 1px solid var(--ex-border-color);
  .list {
    background-color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .thirdLeft {
      flex: 1;
      background-color: var(--ex-default-background-color);
      display: flex;
      font-size: 14px;
      color: var(--ex-default-font-color);
      .item {
        flex: 1;
        margin-right: 30px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .thirdRight {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--ex-font-color9);
      .thirdRightImg {
        width: 10px;
        height: 6px;
        margin-left: 5px;
      }
    }
  }
}
.selectTimes {
  position: absolute;
  height: 100vh;
  width: var(--ex-max-width);
  background: rgba($color: #000000, $alpha: 0.6);
  z-index: 10;
  .times {
    background-color: var(--ex-default-background-color);
    position: absolute;
    width: 100%;
    height: 84px;
    display: flex;
    align-items: center;
    border-radius: 0px 0px 15px 15px;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 15px;
      width: 37px;
      height: 23px;
      background: var(--ex-div-bgColor12);
      border-radius: 2px 2px 2px 2px;
      font-size: 12px;
      color: var(--ex-default-font-color);
    }
  }
}
.studyList {
  display: flex;
  padding: 10px 15px;
  .studyItem {
    font-size: 14px;
    color: var(--ex-default-font-color);
    margin-right: 30px;
  }
}
</style>
