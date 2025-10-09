<script setup>
import { socketDict } from '@/config/dict'
import { _coinWebSocket } from '@/plugin/socket/index'
import { _div, countFormat, priceFormat } from '@/utils/decimal'
import PubSub from 'pubsub-js'
import { reactive } from 'vue'
import { _t18 } from '@/utils/public'
import { matchText } from '@/utils/filters'
import { debounce } from 'lodash'

const props = defineProps({
  /**
   * 行数
   */
  rows: {
    type: Number,
    default: 20
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
 * 当前订阅币种
 */
const currentCoinInfo = reactive({})

/**
 * 订阅客户端列表
 */
const subscribeClientList = reactive([])

/**
 * 数据列表
 */
const dataList = reactive([])

/**
 * 订阅实时成交
 */
const subscribeTrades = async (params) => {
  let marketTradeKey = PubSub.subscribe(socketDict.TRADE, (key, data) => {
    // console.log('实时成交', data, data.data.tick.data[0].price)
    // 实时成交
    if (data.symbol == params.coin && data?.data?.tick?.data) {
      let tempDataList = data.data.tick.data
      if (tempDataList.length >= props.rows) {
        Object.assign(dataList, tempDataList)
      } else {
        dataList.splice(props.rows - tempDataList.length)
        dataList.unshift(...tempDataList)
      }
    }
  })
  subscribeClientList.push(marketTradeKey)
}
/**
 * 交易对监听
 */
const eventTradeSymbolChange = debounce((e) => {
  // 监听币种切换
  console.log('监听币种切换',e.detail.coinInfo)
  let tempCoinInfo = e.detail.coinInfo
  Object.assign(currentCoinInfo, tempCoinInfo)
  subscribeTrades(currentCoinInfo)
  dataList.length = 0
}, 200)
onMounted(() => {
  Object.assign(currentCoinInfo, props.coinInfo)
  subscribeTrades(currentCoinInfo)
  document.addEventListener('event_tradeSymbolChange', eventTradeSymbolChange)
})
onUnmounted(() => {
  document.removeEventListener('event_tradeSymbolChange', eventTradeSymbolChange)

  subscribeClientList.forEach((subKey) => {
    subKey && PubSub.unsubscribe(subKey)
  })
})
</script>
<!-- 成交列表 -->
<template>
  <div class="dealListHeader">
    <!-- 时间 -->
    <div class="time">{{ _t18(`k_time`) }}</div>
    <!-- 方向 -->
    <div class="direction">{{ _t18(`bb_direction`) }}</div>
    <!-- 价格 -->
    <div class="price">{{ _t18(`price`) }}({{ props.coinInfo.baseCoinUpperCase }})</div>
    <!-- 数量 -->
    <div class="count">
      {{ _t18(`metastaking_bb_count`) }}({{
        props.coinInfo.customizeFlag === 2
          ? matchText(props.coinInfo.showSymbol, '/USDT')
          : props.coinInfo.coinUpperCase
      }})
    </div>
  </div>
  <div class="dealItem" v-for="(item, index) in dataList" :key="index">
    <div class="time fw-num">{{ _timeFormat(item.ts, 'HH:mm:ss', true) }}</div>
    <!-- 卖出 -->
    <div class="fall direction fw-bold" v-show="item.direction == 'sell'">
      {{ _t18(`bb_sell1`) }}
    </div>
    <!-- 买入 -->
    <div class="rise direction fw-bold" v-show="item.direction == 'buy'">
      {{ _t18(`purchase`) }}
    </div>
    <div class="price fw-num">{{ priceFormat(item.price) }}</div>
    <div class="count fw-num">{{ countFormat(_div(item.amount, item.price)) }}</div>
  </div>
  <Nodata v-if="dataList.length === 0"></Nodata>
</template>

<style lang="scss" scoped>
.dealListHeader {
  display: flex;
  padding: 20px 15px 0;
  box-sizing: border-box;
  .time,
  .direction,
  .price,
  .count {
    font-size: 12px;
    color: var(--ex-passive-font-color);
    text-align: center;
  }

  .time {
    width: 80px;
    text-align: left;
  }
  .direction {
    width: 70px;
  }
  .price {
    width: 125px;
  }
  .count {
    min-width: 100px;
    text-align: right;
  }
}
.dealItem {
  display: flex;
  padding: 0px 15px 0;
  margin: 10px 0;
  box-sizing: border-box;
  .time,
  .direction,
  .price,
  .count {
    font-size: 12px;
    color: var(--ex-default-font-color);
    text-align: center;
  }
  .time {
    width: 80px;
    text-align: left;
  }
  .direction {
    width: 70px;
  }
  .price {
    min-width: 110px;
  }
  .count {
    min-width: 100px;
    text-align: right;
  }
}
</style>
