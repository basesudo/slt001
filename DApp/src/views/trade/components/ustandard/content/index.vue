<template>
  <div>
    <div class="content">
      <!-- 盘口信息 -->
      <div class="content_left">
        <Handicap :rows="8" :coinInfo="coinInfo" @setTradePrice="setTradePrice"></Handicap>
      </div>
      <!-- 下单 -->
      <div class="content_right">
        <!-- 市价/限价委托  杠杆倍数 -->
        <div class="rightFirst">
          <div class="left firstItem">
            <van-popover v-model:show="showPopover" :show-arrow="false">
              <div class="rightScondList">
                <!-- 市价委托 -->
                <div
                  class="rightScondListItem"
                  :class="transactionLabel ? 'hightBlue' : ''"
                  @click="onSelect(1)"
                >
                  {{ _t18(`bb_market_order`) }}
                </div>
                <!-- 限价委托 -->
                <div
                  class="rightScondListItem"
                  :class="!transactionLabel ? 'hightBlue' : ''"
                  @click="onSelect(0)"
                >
                  {{ _t18(`bb_Limit_order`) }}
                </div>
              </div>
              <template #reference>
                <div class="entrustSelect left">
                  <!-- transactionLabel ? '市价委托' : '限价委托'  -->
                  <div>
                    {{ transactionLabel ? _t18(`bb_market_order`) : _t18(`bb_Limit_order`) }}
                  </div>
                  <svg-load
                    :name="showPopover ? 'jiantou10x5-s' : 'jiantou10x5-x'"
                    class="img"
                  ></svg-load>
                </div>
              </template>
            </van-popover>
          </div>
          <div class="right firstItem">
            <van-popover v-model:show="showPopoverNum" :show-arrow="false">
              <div class="rightScondListNum" v-if="numList.length > 0">
                <div
                  v-for="item in numList"
                  :key="item.id"
                  class="rightScondListItem"
                  :class="item.name === transactionNum ? 'hightBlue' : ''"
                  @click="selectNum(item)"
                >
                  {{ item.name }}
                </div>
              </div>
              <template #reference>
                <div class="entrustSelect right">
                  <div class="fw-num">{{ transactionNum }}</div>
                  <svg-load v-if="!showPopoverNum" name="jiantou10x5-x" class="img"></svg-load>
                  <svg-load v-if="showPopoverNum" name="jiantou10x5-s" class="img"></svg-load>
                </div>
              </template>
            </van-popover>
          </div>
        </div>
        <!-- 市价占位 -->
        <div class="rightThird" v-if="transactionLabel">{{ _t18(`market_price`) }}</div>
        <!-- 市价委托：数量(手lots/张lots2) -->
        <div class="rightFifth" v-if="transactionLabel">
          <input
            type="number"
            v-model.trim="delegateTotal"
            class="amount"
            :placeholder="`${_t18(`metastaking_bb_count`)}(${_t18(`lots`)})`"
          />
        </div>
        <!-- 限价委托：价格，数量 -->
        <div class="rightFifth" v-if="!transactionLabel">
          <!-- 价格 -->
          <input
            type="number"
            class="amount"
            v-model.trim="delegatePrice"
            :placeholder="_t18(`price`)"
          />
        </div>
        <div class="rightFifth" v-if="!transactionLabel">
          <!-- 数量(手lots/张lots2) -->
          <input
            type="number"
            v-model.trim="delegateTotal"
            class="amount"
            :placeholder="`${_t18(`metastaking_bb_count`)}(${_t18(`lots`)})`"
          />
        </div>
        <!-- slider滑动条 -->
        <div class="rightFourth">
          <div class="lineBg">
            <div
              :class="
                sliderValue === 0 ? 'node' : index * 25 > sliderValue ? 'node' : 'node active'
              "
              v-for="(item, index) in 5"
              :key="index"
            ></div>
          </div>
          <van-slider v-model="sliderValue" active-color="#515151" inactive-color="#d9d9d9">
            <template #button>
              <div class="init">
                <div
                  :class="{
                    marl: sliderValue <= 3,
                    marr: sliderValue > 98
                  }"
                >
                  <div class="initimg"></div>
                  <div class="initNum ff-num">{{ sliderValue }}%</div>
                </div>
              </div>
            </template>
          </van-slider>
        </div>
        <!-- 可用 -->
        <div class="rightSix">
          <div>{{ _t18(`account_available`) }}</div>
          <div class="number fw-num">{{ availableBalance }} USDT</div>
        </div>
        <!-- 买入(做多)按钮 -->
        <div class="rightSeven">
          <div class="maybutton" @click="buyOrSell(0)">
            {{ _t18(`purchase`) }} ({{ _t18(`going_long`) }})
          </div>
        </div>
        <!-- 可开空 paxpay特殊-->
        <div class="nineSix">
          <p v-if="['paxpay'].includes(_getConfig('_APP_ENV'))">
            {{ _t18(`openable_more`, ['paxpay']) }}
          </p>
          <p v-else>{{ _t18(`openable`, ['aams']) }}</p>
          <div class="number fw-num">
            {{ bearableValue ? _toFixed(bearableValue, 4) : 0 }}
            {{
              coinInfo.customizeFlag === 2
                ? matchText(coinInfo.showSymbol, '/USDT')
                : coinInfo.coin?.toUpperCase()
            }}
          </div>
        </div>
        <!-- 保证金 -->
        <div class="nineSix">
          <div>{{ _t18(`cash_deposit`) }}</div>
          <div class="number fw-num">{{ _toFixed(marginValue, 4) }} USDT</div>
        </div>
        <!-- 合约面值 das特殊-->
        <div class="nineSix">
          <div>{{ _t18(`contract_face_value`, ['aams']) }}</div>
          <div class="number fw-num">
            {{ coinInfo.shareNumber }}
            <span v-if="['das'].includes(_getConfig('_APP_ENV'))">
              {{ coinInfo.customizeFlag === 2 ? matchText(coinInfo.showSymbol, '/USDT') : 'USDT' }}
            </span>
            <span v-else>
              {{
                coinInfo.customizeFlag === 2
                  ? matchText(coinInfo.showSymbol, '/USDT')
                  : coinInfo.coin?.toUpperCase()
              }}
            </span>
            /{{ _t18(`lots`) }}
          </div>
        </div>
        <!-- 卖出(开空)按钮 -->
        <div class="rightSeven">
          <div class="maybutton hightColorRed" @click="buyOrSell(1)">
            {{ _t18(`bb_sell1`) }} ({{ _t18(`open_short`) }})
          </div>
        </div>
        <!-- 可开空 paxpay特殊-->
        <div class="nineSix">
          <p v-if="['paxpay'].includes(_getConfig('_APP_ENV'))">
            {{ _t18(`openable_less`, ['paxpay']) }}
          </p>
          <p v-else>{{ _t18(`openable`, ['aams']) }}</p>
          <div class="number fw-num">
            {{ bearableValue ? _toFixed(bearableValue, 4) : 0 }}
            {{
              coinInfo.customizeFlag === 2
                ? matchText(coinInfo.showSymbol, '/USDT')
                : coinInfo.coin?.toUpperCase()
            }}
          </div>
        </div>
        <!-- 保证金 -->
        <div class="nineSix">
          <div>{{ _t18(`cash_deposit`) }}</div>
          <div class="number fw-num">{{ _toFixed(marginValue, 4) }} USDT</div>
        </div>
        <!-- 合约面值 das特殊 -->
        <div class="nineSix">
          <div>{{ _t18(`contract_face_value`, ['aams']) }}</div>
          <div class="number fw-num">
            {{ coinInfo.shareNumber }}
            <span v-if="['das'].includes(_getConfig('_APP_ENV'))">
              {{ coinInfo.customizeFlag === 2 ? matchText(coinInfo.showSymbol, '/USDT') : 'USDT' }}
            </span>
            <span v-else>
              {{
                coinInfo.customizeFlag === 2
                  ? matchText(coinInfo.showSymbol, '/USDT')
                  : coinInfo.coin?.toUpperCase()
              }}
            </span>
            /{{ _t18(`lots`) }}
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <!-- 订单 -->
    <!-- 订单信息 -->
    <OrderListBox
      ref="orderListBoxRef"
      :coinInfo="coinInfo"
      :availableBalance="availableBalance"
    ></OrderListBox>
  </div>
</template>

<script setup>
import { _mul, _div, _toFixed } from '@/utils/decimal'
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()
import Handicap from '../../common/handicap.vue'
import OrderListBox from './OrderList.vue'
import { _t18 } from '@/utils/public'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
import { matchText, formatCurrentcurrency } from '@/utils/filters'
import {
  submitUcontract,
  contractHistoryList,
  contractLossList,
  orderList
} from '@/api/trade/index'
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()

import { useUserStore } from '@/store/user/index'
const userStore = useUserStore()
const { asset } = storeToRefs(userStore)
import { socketDict } from '@/config/dict'
import PubSub from 'pubsub-js'
const orderListBoxRef = ref(null)
const props = defineProps({
  coinInfo: {
    type: Object,
    default: () => {}
  }
})
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[props.coinInfo.coin] || {}
})
const delegateTotal = ref('') // 数量（市价/限价）
const delegatePrice = ref('') // 价格（限价）
const sliderValue = ref(0) //滑动
//可用余额
const availableBalance = computed(() => {
  var cur = asset.value.filter((item) => {
    return item.type === 3
  })

  if (cur.length > 0) {
    return cur[0].availableAmount
  } else {
    return ''
  }
})

const marginValue = ref('0') //保证金
/**
 * 市价/限价委托
 */
const showPopover = ref(false) // 委托类型
const transactionLabel = ref(1) // 市价  1  限价 0
const onSelect = (item) => {
  transactionLabel.value = item
  showPopover.value = false
  delegateTotal.value = ''
  delegatePrice.value = ''
  sliderValue.value = 0
}

// 限价委托：设置交易价格
const setTradePrice = (val) => {
  delegatePrice.value = !transactionLabel.value ? val : ''
}
const contractObj = ref({}) // 币种对象
/**
 * 杠杆倍数
 */
const showPopoverNum = ref(false) //弹窗
const transactionNum = ref(null) //倍数
const numList = ref([]) //杠杆下拉
// 切换杠杆倍数
const selectNum = (item) => {
  transactionNum.value = item.name
  showPopoverNum.value = false
}
// 切换币种：重置价格、数量，杠杆变化
watch(
  () => props.coinInfo.coin,
  (n) => {
      delegateTotal.value = ''
      setTradePrice()
      if (tradeStore.contractCoinList.length) {
        numList.value = []
        transactionNum.value = ''
        let newcoin = {}
        tradeStore.contractCoinList.forEach((element) => {
          if (element.coin === n) {
            contractObj.value = element
            newcoin = element
            return
          }
        })
        if (newcoin?.leverage) {
          newcoin.leverage.split(',').forEach((ele) => {
            numList.value.push({
              name: ele + 'X',
              id: ele
            })
          })
        }
        transactionNum.value = numList.value[0].name
      }
  }
)
// 监听滑块，修改数量（手）
watch(
  () => sliderValue.value,
  (n) => {
    console.log(n)
    let priceNew
    if (transactionLabel.value) {
      // 市价委托
      priceNew = coinPriceInfo.value.close
    } else {
      // 限价委托
      priceNew = delegatePrice.value
    }
    if (!priceNew) {
      sliderValue.value = 0
      return
    }
    let numberSlider
    if (['das'].includes(__config._APP_ENV)) {
      // 可用余额/合约面值
      // availableBalance/shareNumber
      numberSlider = _div(availableBalance.value, props.coinInfo.shareNumber)
    } else {
      // 可用余额*杠杆倍数/可用余额市价或输入价格/合约面值
      // availableBalance*transactionNum/priceNew/shareNumber
      numberSlider = _div(
        _div(
          _mul(
            availableBalance.value,
            transactionNum.value.substr(0, transactionNum.value.length - 1)
          ),
          priceNew
        ),
        props.coinInfo.shareNumber
      )
    }
    // 向下取整
    delegateTotal.value = Math.floor(_mul(numberSlider, _div(n, 100)))
  }
)
//监听数量，计算保证金
watch(
  () => delegateTotal.value,
  (n) => {
    if (n) {
      const regex = /^[1-9]\d*$/
      if (!regex.test(n)) {
        // 数量只能输入整数
        return _toast('quantitycan_onlyenter_integers')
      } else {
        var typeId = ''
        numList.value.forEach((element) => {
          if (element.name === transactionNum.value) {
            return (typeId = element.id)
          }
        })

        if (['das'].includes(__config._APP_ENV)) {
          // das平台：保证金=手*合约面值
          // delegateTotal.value*contractObj.value.shareNumber
          marginValue.value = _mul(delegateTotal.value, contractObj.value.shareNumber)
        } else {
          //保证金=价格*数量*合约面值/杠杆倍数
          // coinPriceInfo.value.close*n*contractObj.value.shareNumber/typeId
          marginValue.value = _toFixed(
            _div(_mul(_mul(coinPriceInfo.value.close, n), contractObj.value.shareNumber), typeId),
            6
          )
        }
      }
    } else {
      marginValue.value = '0'
    }
  }
)
// 监听价格
watch(
  () => delegatePrice.value,
  (n) => {
    if (n) {
      if (!/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(n) || Number(n) === 0) {
        // 请输入最多保留6位小数的大于0的价格
        return _toast('Please_entera_price_greater')
      }
    } else {
      sliderValue.value = 0
      delegateTotal.value = ''
    }
  }
)
// 监听杠杆倍数
watch(
  () => transactionNum.value,
  (n) => {
    const CurN = n.substr(0, n.length - 1)
    let priceNew
    if (transactionLabel.value) {
      priceNew = coinPriceInfo.value.close
    } else {
      priceNew = delegatePrice.value
    }
    if (!priceNew) {
      sliderValue.value = 0
      return
    }
    let numberSlider = _div(
      _div(_mul(availableBalance.value, CurN), priceNew),
      props.coinInfo.shareNumber
    )
    // // 向下取整
    if (!['das'].includes(__config._APP_ENV)) {
      delegateTotal.value = Math.floor(_mul(numberSlider, _div(sliderValue.value, 100)))
    }
  }
)
// 可开空=可用/价格*杠杆倍数
// das可开空=合约面值*手/价格*杠杆
const bearableValue = computed(() => {
  let price = transactionLabel.value ? coinPriceInfo.value.close : delegatePrice.value
  if (price) {
    var typeId = ''
    numList.value.forEach((element) => {
      if (element.name === transactionNum.value) {
        return (typeId = element.id)
      }
    })
    let result
    if (['das'].includes(__config._APP_ENV)) {
      result = _mul(_div(_mul(delegateTotal.value, contractObj.value.shareNumber), price), typeId)
    } else {
      result = _mul(_div(availableBalance.value, price), typeId)
    }
    return result
  } else {
    return 0
  }
})
// 初始化杠杆倍数
const init = () => {
  if (tradeStore.contractCoinList.length) {
    numList.value = []
    transactionNum.value = ''
    tradeStore.contractCoinList.forEach((element) => {
      if (element.coin === props.coinInfo.coin) {
        contractObj.value = element
        if (element.leverage) {
          element.leverage.split(',').forEach((element) => {
            numList.value.push({
              name: element + 'X',
              id: element
            })
          })
        }
        transactionNum.value = numList.value[0].name
        return
      }
    })
  }
}

/**
 * 买入/卖出按钮
 */
const buyOrSellForm = (type) => {
  // 杠杆倍数
  var typeId = ''
  numList.value.forEach((element) => {
    if (element.name === transactionNum.value) {
      return (typeId = element.id)
    }
  })
  let data = {
    symbol: props.coinInfo.coin, //币种
    leverage: typeId, //杠杆倍数
    delegatePrice: transactionLabel.value ? coinPriceInfo.value.close : delegatePrice.value, //价格
    delegateTotal: delegateTotal.value, //数量
    type: type, //0买入 1卖出
    delegateType: transactionLabel.value //委托类型0市价 1限价
  }
  if (
    !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(data.delegatePrice) ||
    Number(data.delegatePrice) === 0
  ) {
    // 请输入最多保留6位小数的大于0的价格
    return _toast('Please_entera_price_greater')
  }
  if (!/^[1-9]\d*$/.test(data.delegateTotal)) {
    // 数量只能输入整数
    return _toast('quantitycan_onlyenter_integers')
  }
  try {
    showLoadingToast({
      forbidClick: true,
      duration: 0
    })
    submitUcontract(data).then((res) => {
      if (res.code === 200) {
        // !type ? '买入' : '卖出'}成功`
        _toast('quote_addSuccess')
        // 刷新订单
        orderListBoxRef.value.handelRefresh()
        userStore.getUserInfo()
      } else {
        closeToast()
        showToast(res.msg)
      }
    })
  } catch (error) {
    closeToast()
  }
}
const buyOrSell = (type) => {
  if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE)) {
      buyOrSellForm(type)
    }
  } else {
    buyOrSellForm(type)
  }
}

onMounted(() => {
  // init()
})
// 当前持仓 当前委托 止盈止损 历史委托
const trusetList = ref([
  {
    // name: ['coinsexpto'].includes(__config._APP_ENV)?_t18(`current_position2`):_t18(`current_position`,['latcoin']),
    name: _t18(`current_position`, ['latcoin']),
    num: 0,
    show: true
  },
  {
    name: _t18(`exchange_curentrust`, ['bitmake', 'ebc', 'latcoin']),
    num: 0,
    show: true
  },
  {
    name: _t18(`profit_loss`, ['paxpay', 'latcoin', 'aams']),
    num: 0,
    show: true
  },
  {
    // name: _t18(`exchange_hisentrust`, ['bitmake', 'ebc','latcoin']),
    name: ['coinsexpto'].includes(__config._APP_ENV)
      ? _t18(`exchange_hisentrust2`)
      : _t18(`exchange_hisentrust`, ['bitmake', 'ebc', 'latcoin']),
    num: 0,
    show: true
  }
])

/**
 * 订单模块
 */

/** 更新user */
const updateUser = () => {
  userStore.getUserInfo()
}
/**
 * 订单结算，更新订单和用户信息
 */
const coinOverKey = ref('')
const settlementKey = ref('')

const coinOverNotification = () => {
  /**
   * rxce平台周期改变通知
   */
  coinOverKey.value = PubSub.subscribe(socketDict.POSITION, (key, data) => {
    const { position } = JSON.parse(data.date.message)
    if (position) {
      orderListBoxRef.value.init()
      updateUser()
    }
  })
  /**
   * 结算改变通知
   */
  settlementKey.value = PubSub.subscribe(socketDict.SETTLEMENT, (key, data) => {
    const { type } = JSON.parse(data.date.message)
    if (type == 2) {
      orderListBoxRef.value.init()
      updateUser()
    }
  })
}
coinOverNotification()

onUnmounted(() => {
  settlementKey && PubSub.unsubscribe(settlementKey)
  coinOverKey && PubSub.unsubscribe(coinOverKey)
})
</script>

<style lang="scss" scoped>
.hightBlue {
  color: var(--ex-font-color2) !important;
}
.hightColorRed {
  color: var(--ex-font-color) !important;
  background-color: var(--ex-div-bgColor7) !important;
}
.content {
  display: flex;
  padding: 20px 15px;
}
.content_right {
  flex: 1;
  .rightFirst {
    height: 33px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    .firstItem {
      background: var(--ex-div-bgColor);
      border-radius: 2px 2px 2px 2px;
    }
    .left {
      width: 104px;
    }
    .right {
      width: 66px;
    }
    .entrustSelect {
      // background: var(--ex-default-background-color);
      padding: 0 10px;
      height: 33px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      color: var(--ex-default-font-color);

      .img {
        width: 10px;
        height: 5px;
      }
    }
    .entrustSelect2 {
      justify-content: center;
    }
  }
  .rightThird {
    margin-top: 10px;
    width: 180px;
    height: 33px;
    background: var(--ex-div-bgColor5);
    border-radius: 2px 2px 2px 2px;
    font-size: 12px;
    color: var(--ex-font-color1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .rightFourth {
    margin-top: 25px;
    width: 180px;
    position: relative;
    .lineBg {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 0;
      .node {
        width: 11px;
        height: 11px;
        background: var(--ex-div-bgColor3);
        margin-top: -5px;
        transform: rotate(45deg);
      }
      .active {
        background: var(--ex-div-bgColor4);
      }
    }
    .init {
      .marl {
        margin-left: 11px;
        .initNum {
          margin-left: 22px;
        }
      }
      .marr {
        margin-right: 11px;
        .initNum {
          margin-right: 11px;
        }
      }
      .initimg {
        width: 12px;
        height: 12px;
        background: var(--ex-div-bgColor4);
        transform: scaleY(0.5) rotate(45deg) !important;
        position: relative;
      }
      .initNum {
        transform: scaleY(0.5);
        margin-top: 8px;
        font-size: 12px;
        color: var(--ex-font-color);
        padding: 3px 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ex-div-bgColor19);
        border-radius: 1px;
        position: absolute;
        top: -20px;
        left: -20px;
      }
    }
  }
  .rightFifth {
    margin-top: 10px;
    .amount {
      width: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 33px;
      background: var(--ex-div-bgColor);
      border-radius: 2px;
      font-size: 12px;
      color: var(--ex-default-font-color);
      text-align: center;
    }
    input::-webkit-input-placeholder {
      color: var(--ex-font-color1);
    }
    input::-moz-input-placeholder {
      color: var(--ex-font-color1);
    }
    input::-ms-input-placeholder {
      color: var(--ex-font-color1);
    }
  }
  .rightSix {
    margin-top: 25px;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--ex-passive-font-color);
    .number {
      color: var(--ex-default-font-color);
    }
  }
  .rightSeven {
    margin-top: 16px;
    .maybutton {
      height: 40px;
      background: var(--ex-div-bgColor1);
      border-radius: 3px 3px 3px 3px;
      font-size: 14px;
      color: var(--ex-font-color);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .nineSix {
    margin-top: 15px;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--ex-passive-font-color);
    .number {
      text-align: right;
      color: var(--ex-default-font-color);
    }
  }
}
// 市价/限价下拉框
.rightScondList {
  width: 104px;
  // margin-top: 3px;
  background-color: var(--ex-default-background-color);
  padding: 5px 0;
  font-size: 12px;
  color: var(--ex-passive-font-color);
  .rightScondListItem {
    padding: 10px 0;
    text-align: center;
  }
}
.rightScondListNum {
  width: 66px;
  // margin-top: 3px;
  background-color: var(--ex-default-background-color);
  padding: 5px 0;
  font-size: 12px;
  color: var(--ex-passive-font-color);
  .rightScondListItem {
    padding: 10px 0;
    text-align: center;
  }
}
:deep(.van-slider) {
  z-index: 2;
  height: 1px;
  top: -1px;
  .van-slider__bar {
    transform: scaleY(2);
  }
}
.line {
  height: 5px;
  background: var(--ex-div-bgColor10);
}
.entrust {
  position: relative;
}
:deep(.van-tabs__nav) {
  padding-right: 80px;
}
.entrustR {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #fff;
  padding: 15px 5px;
  .entrustRImg {
    padding: 0 8px;
    font-size: 12px;
  }
}
</style>
