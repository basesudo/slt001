<template>
  <!-- K线 -->
  <Candlestick :coinInfo="coinInfo" type="secondContract"></Candlestick>
  <div class="line"></div>
  <!-- 订单信息 -->
  <div class="entrust">
    <div class="entrustL">
      <!-- 当前委托 -->
      <div
        :class="currentEntruset === 0 ? 'entrustItem hightItem' : 'entrustItem'"
        @click="switchingEntrust(0)"
      >
        {{ _t18(`exchange_curentrust`, ['bitmake', 'ebc']) }}{{ firstNum ? `(${firstNum})` : '' }}
      </div>
      <!-- 历史委托 -->
      <div
        :class="currentEntruset === 1 ? 'entrustItem hightItem' : 'entrustItem'"
        @click="switchingEntrust(1)"
      >
        {{ _t18(`exchange_hisentrust`, ['bitmake', 'ebc']) }}{{ secondNum ? `(${secondNum})` : '' }}
      </div>
    </div>

    <!-- 隐藏其他币种，刷新 -->
    <div class="entrustR">
      <svg-load
        v-if="currentEye"
        name="yanjin-k"
        class="entrustRImg"
        @click="switchingEye"
      ></svg-load>
      <svg-load
        v-if="!currentEye"
        name="yanjin-g"
        class="entrustRImg"
        @click="switchingEye"
      ></svg-load>
      <svg-load name="shuaxin" class="entrustRUpdateImg" @click="toRefresh"></svg-load>
    </div>
  </div>
  <!-- 合约历史 -->
  <div v-if="historyNewList.length > 0">
    <ContractHistory
      :currentEntruset="currentEntruset"
      :itemHistroy="item"
      v-for="item in historyNewList"
      :key="item.userId"
      @recombine="remove"
      @updateRecord="updateRecord"
      @shareRevenue="shareRevenue"
    ></ContractHistory>
  </div>

  <!-- 暂无数据   -->
  <Nodata v-if="historyNewList.length === 0"></Nodata>
  <div class="placeholder"></div>

  <!-- 分享收益-->
  <van-overlay :show="shareShow" class="share-revenue-box" @click="shareShow = false">
    <div class="share-revenue" @click.stop="">
      <ShareCommissionDetail :historical-data="revenueDetails" />
    </div>
  </van-overlay>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { _div } from '@/utils/decimal'
import { showLoadingToast, closeToast } from 'vant'
import { useRoute } from 'vue-router'
import Candlestick from '../../common/candlestick.vue'
import ContractHistory from './contractHistory.vue'
import ShareCommissionDetail from './../../common/ShareCommissionDetail.vue'

import { secondContractOrderselectOrderList } from '@/api/trade/index'
import { formatCurrentcurrency, profitAndloss } from '@/utils/filters'
import { _t18 } from '@/utils/public'
import { useUserStore } from '@/store/user'

import { socketDict } from '@/config/dict'
import PubSub from 'pubsub-js'

const props = defineProps({
  coinInfo: {
    type: Object,
    default: () => {}
  }
})
const $route = useRoute()
const currentEntruset = ref(0) // 委托状态 0 进行中 1 完成
const currentEye = ref(true) // 当前眼睛
const historyList = ref([])
const historyNewList = ref([])
// 当前委托/历史委托切换
const switchingEntrust = (e) => {
  currentEntruset.value = e
  historyNewList.value = []
  getList(e)
}
// 切换眼睛（隐藏其他交易数据）
const switchingEye = () => {
  currentEye.value = !currentEye.value
  filterEyes()
}
/** 过滤当前的数据 */
const filterEyes = () => {
  if (currentEye.value) {
    historyNewList.value = historyList.value
  } else {
    historyNewList.value = formatCurrentcurrency(historyList.value, props.coinInfo.symbol)
  }
}
// 刷新
const toRefresh = () => {
  showLoadingToast({
    forbidClick: true,
    duration: 0
  })
  updateList()
}

const updateList = () => {
  historyNewList.value = []
  getList(currentEntruset.value)
}

defineExpose({
  updateList
})
watch(
  () => $route.query,
  () => {
    filterEyes()
  }
)
watch(
  () => currentEye.value,
  (n) => {
    if (n) {
      historyNewList.value = historyList.value
    }
  }
)
/**过滤倒计时 */
const fifterTimeDown = (data) => {
  if (data.length > 0) {
    if (!currentEntruset.value) {
      data.forEach((element, i) => {
        if (element.time <= 0) {
          data.splice(i, 1)
        }
      })
    }
    return data
  } else {
    return data
  }
}
const remove = (item, num) => {
  if (num < 0) {
    historyNewList.value.forEach((element, index) => {
      if (element.userId === item.userId) {
        historyNewList.value.splice(index, 1)
      }
    })
  }
}
// 完成更新
const updateRecord = () => {
  getNumber(0)
  getNumber(1)
  getList(currentEntruset.value)
}
// 获取委托
const firstNum = ref(0)
const secondNum = ref(0)
const getList = async (status) => {
  try {
    const res = await secondContractOrderselectOrderList({ status: status })
    if (res.code === 200) {
      const result = res.data
      if (status) {
        secondNum.value = result.length
      } else {
        firstNum.value = result.length
      }
      historyList.value = fifterTimeDown(result)
      historyNewList.value = historyList.value
      filterEyes()
      closeToast()
    } else {
      closeToast()
    }
  } catch (error) {
    closeToast()
  }
}
const getNumber = async (status) => {
  try {
    const res = await secondContractOrderselectOrderList({ status: status })
    if (res.code === 200) {
      const result = res.data
      if (status) {
        secondNum.value = result.length
      } else {
        firstNum.value = result.length
      }
    }
  } catch (error) {}
}
onMounted(() => {
  getList(0)
  getNumber(1)
})

// 分享收益
const shareShow = ref(false)
const revenueDetails = ref({}) // 收益详情
const closePosition = _t18('Close_position')

// 盈亏金额计算

const shareRevenue = (model) => {
  // 盈亏金额
  let amuout = profitAndloss(model.betAmount, model.rewardAmount)

  // 二维码链接
  const shareLink = `${location.origin}/#/i&`
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  const sharkCode = userInfo?.user?.activeCode

  // 组件赋值
  revenueDetails.value = {
    profitAndLossAmount: amuout > 0 ? amuout.toString() : amuout, // 盈亏金额
    TransactionType: model.coinSymbol.toUpperCase() + '/' + model.baseSymbol.toUpperCase(), // 交易类型
    CurrencyName: closePosition, // 币种名
    OpeningPrice: model.openPrice.toString(), // 开仓价格
    ClosingPrice: model.closePrice.toString(), // 平仓价格
    type: model.type,
    // QrCode: shareLink + sharkCode, // 二维码
    QrCode: location.origin,
    bgType: `1`, //背景类型，此参数当为用户设置， 暂定1 为默认白色
    currencyUnit: model.baseSymbol.toUpperCase()
  }
  console.log(revenueDetails)
  shareShow.value = !shareShow.value
}

/**
 * 订单结算，更新订单和用户信息
 */
const userStore = useUserStore()
const settlementKey = ref('')

const settlementNotification = () => {
  /**
   * 结算改变通知
   */
  settlementKey.value = PubSub.subscribe(socketDict.SETTLEMENT, (key, data) => {
    const { type } = JSON.parse(data.date.message)
    if (type == 3) {
      console.log(888)
      getList(0)
      getList(1)
      userStore.getUserInfo()
    }
  })
}
settlementNotification()
onUnmounted(() => {
  settlementKey && PubSub.unsubscribe(settlementKey)
})
const submit = () => {
  if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE)) {
      submitForm()
    }
  } else {
    submitForm()
  }
}
</script>
<style lang="scss" scoped>
.placeholder {
  height: 104px;
}

.hightItem {
  color: var(--ex-active-font-color) !important;
}

.line {
  height: 5px;
  background: var(--ex-div-bgColor10);
}

.entrust {
  height: 50px;
  display: flex;
  padding: 0 15px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--ex-border-color);

  .entrustL {
    font-size: 14px;
    color: var(--ex-default-font-color);
    display: flex;

    .entrustItem {
      margin-right: 16px;
    }
  }

  .entrustR {
    display: flex;
    align-items: center;

    .entrustRImg {
      width: 16px;
      height: 12px;
    }

    .entrustRUpdateImg {
      margin-left: 20px;
      width: 12px;
      height: 12px;
    }
  }
}

// 分享弹出层
.share-revenue-box {
  z-index: 99;

  .share-revenue {
    :deep(.share-commission) {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: var(--ex-default-background-color);
      min-width: 300px;
      border-radius: 30px;
    }
  }
}
</style>
