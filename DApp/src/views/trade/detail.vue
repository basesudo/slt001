<!-- 实时成交 -->
<template>
  <div>
    <van-sticky>
      <header>
        <svg-load name="jiantou-z" class="leftImg" @click="_back()"></svg-load>
        <div class="right">
          <div class="central">
            <svg-load name="cebian17x14" class="firLeftImg" @click="showLeft"></svg-load>
            <div class="fw-bold">{{ coinInfo.showSymbol }}</div>
          </div>
        </div>
      </header>
    </van-sticky>
    <div class="top">
      <div class="second">
        <div class="secondLeft">
          <div :class="[_isRFD(coinPriceInfo.open, coinPriceInfo.close, 'buy', 'rise'), ' fw-num']">
            {{ coinPriceInfo.close }}
          </div>
          <div
            :class="[
              _isRFD(coinPriceInfo.openPrice, coinPriceInfo.close, 'buy', 'rise'),
              ' rfd-sign secondLeftB fw-num'
            ]"
          >
            {{ coinPriceInfo?.priceChangePercent }}%
          </div>
        </div>
        <div class="secondRight">
          <div class="secondItem">
            <!-- 高 -->
            <div class="itemL">{{ _t18(`k_hight`, ['ebc']) }}</div>
            <div class="itemR fw-num">{{ priceFormat(coinPriceInfo.high24) }}</div>
          </div>
          <div class="secondItem">
            <!-- 低 -->
            <div class="itemL">{{ _t18(`k_low`, ['ebc']) }}</div>
            <div class="itemR fw-num">{{ priceFormat(coinPriceInfo.low24) }}</div>
          </div>
          <div class="secondItem">
            <!-- 量 -->
            <div class="itemL">{{ _t18(`k_quantity`) }}</div>
            <div class="itemR fw-num">{{ countFormat(coinPriceInfo.volume24) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- K线 -->
    <Candlestick v-if="coinInfo.coin" :coinInfo="coinInfo" type="detail"></Candlestick>
    <div class="line"></div>
    <!-- 成交/深度图 -->
    <div class="entrust">
      <div class="entrustL">
        <!-- 实时成交 -->
        <div class="entrustItem hightItem">{{ _t18(`real_time_transaction`) }}</div>
        <!-- <div
        :class="currentEntruset ? 'entrustItem hightItem' : 'entrustItem'"
        @click="switchingEntrust"
      >
        深度图
      </div> -->
      </div>
    </div>
    <!-- 成交列表 -->
    <DealList v-if="coinInfo.coin" :coinInfo="coinInfo" :rows="20"></DealList>
    <!-- 左侧 -->
    <PublicPopup
      :show="showOverlay"
      :direction="`left`"
      @handelClose="handelClose"
      :height="`100%`"
      :width="`80%`"
      :showHeader="false"
      :empty="false"
    >
      <template #emptyContentCustomize>
        <LeftSide @linkTo="linkTo" @close="handelClose"></LeftSide>
      </template>
    </PublicPopup>
  </div>
</template>

<script setup>
import Candlestick from './components/common/candlestick.vue'
import DealList from './components/common/dealList.vue'
import PublicPopup from '@/components/Popup/public.vue'
import LeftSide from './components/common/leftSide.vue'
import { countFormat, priceFormat } from '@/utils/decimal'
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const $route = useRoute()
// 左侧导航
const showOverlay = ref(false)
const showLeft = () => {
  showOverlay.value = true
}
const handelClose = () => {
  showOverlay.value = false
}
// 成交/深度图
const currentEntruset = ref(false) // 成交/深度图状态
// 成交/深度图切换
const switchingEntrust = () => {
  currentEntruset.value = !currentEntruset.value
}
const coinInfo = computed(() => {
  let temp = {}
  if (Number($route.query.type) == 2) {
    if ($route.query.symbol) {
      temp =
        tradeStore.contractCoinList.filter((obj) => {
          return obj.coin === $route.query.symbol
        })[0] || tradeStore.contractCoinList[0]
    } else {
      temp = tradeStore.contractCoinList[0]
    }
  } else {
    if ($route.query.symbol) {
      temp =
        tradeStore.spotCoinList.filter((obj) => {
          return obj.coin === $route.query.symbol
        })[0] || tradeStore.spotCoinList[0]
    } else {
      temp = tradeStore.spotCoinList[0]
    }
  }

  return temp
})
const getHeader = () => {}
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[coinInfo.value.coin] || {}
})

/** 更换当前路由信息 */
const linkTo = (item, type) => {
  $route.query.symbol = item
  $route.query.type = type||$route.query.type
  showOverlay.value = false
  getHeader()
}
watch(
  () => {
    coinInfo.value.coin
  },
  (val, oldVal) => {
    tradeStore.setCurrentCoinList(oldVal, 'remove')
    tradeStore.setCurrentCoinList(val)
  }
)
onMounted(() => {
  mainStore.setTradeFlag(mainStore.tradeFlag + mainStore.isOption)
  getHeader()
})
onUnmounted(() => {
  tradeStore.setCurrentCoinList(coinInfo.value.coin, 'remove')
})
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  display: flex;
  height: 60px;
  padding: 0 15px;
  align-items: center;
  background-color: var(--ex-default-background-color);
  z-index: 99;
  justify-content: space-between;
  border-bottom: 1px solid var(--ex-border-color);
  position: relative;
  .leftImg {
    width: 16px;
    height: 12px;
  }
  .right {
    .senLeftImg {
      width: 24px;
      height: 24px;
      margin-left: 10px;
      display: none;
    }
    .central {
      font-size: 16px;
      color: var(--ex-default-font-color);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      .firLeftImg {
        width: 17px;
        height: 14px;
        margin-right: 10px;
      }
    }
  }
}
.top {
  background-color: var(--ex-default-background-color);
  .second {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 15px;
    .secondLeft {
      font-size: 36px;
      font-weight: bold;
      color: var(--ex-font-color10);
      > * {
        transition: 0.3s;
      }
      .secondLeftB {
        font-size: 14px;
        margin-top: 5px;
      }
    }
    .secondRight {
      .secondItem {
        display: flex;
        align-items: center;
        padding: 6px 0;
        font-size: 14px;
        .itemL {
          color: var(--ex-passive-font-color);
          margin-right: 10px;
        }
        .itemR {
          color: var(--ex-default-font-color);
        }
      }
    }
  }
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
      margin-right: 30px;
    }
    .hightItem {
      font-weight: bold;
      // color: var(--ex-font-color9);
    }
  }
}
</style>
