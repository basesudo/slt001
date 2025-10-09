<template>
  <div>
    <div class="top">
      <div class="first">
        <!-- 打开弹窗 -->
        <div class="firLeft">
          <svg-load
            name="cebian17x14"
            class="firLeftImg"
            @click="emits('showSidePopup')"
          ></svg-load>
          <div class="fw-bold">{{ coinInfo.showSymbol }}</div>
        </div>
        <!-- 秒合约规则，收藏 -->
        <div class="first">
          <svg-load
            name="guize"
            class="senLeftImg"
            @click="_toView('/tradingRules?type=0')"
          ></svg-load>
          <!-- <svg-load
            v-if="mainStore.hasOption"
            @click="setCollectByCoin"
            :name="coinCollect ? 'tianjia24x24-x' : 'tianjia24x24-w'"
            class="senLeftImg"
          ></svg-load> -->
        </div>
      </div>
      <div class="second">
        <!-- 当前币种价格 -->
        <div class="secondLeft">
          <div :class="[_isRFD(coinPriceInfo.open, coinPriceInfo.close, 'buy', 'rise'), ' fw-num']">
            {{ coinPriceInfo.close || '0.00' }}
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
          <!-- 高 -->
          <div class="secondItem">
            <div class="itemL">{{ _t18(`k_hight`, ['ebc']) }}</div>
            <div class="itemR fw-num" v-if="coinPriceInfo?.high24">
              {{ priceFormat(coinPriceInfo.high24) }}
            </div>
            <div class="itemR fw-num" v-else>
              {{ priceFormat(tradeStore.klineTicker.highPrice || 0) }}
            </div>
          </div>
          <!-- 低 -->
          <div class="secondItem">
            <div class="itemL">{{ _t18(`k_low`, ['ebc']) }}</div>
            <div class="itemR fw-num" v-if="coinPriceInfo?.low24">
              {{ priceFormat(coinPriceInfo.low24) }}
            </div>
            <div class="itemR fw-num" v-else>
              {{ priceFormat(tradeStore.klineTicker.lowPrice || 0) }}
            </div>
          </div>
          <!-- 量 -->
          <div class="secondItem">
            <div class="itemL">{{ _t18(`k_quantity`) }}</div>
            <div class="itemR fw-num" v-if="coinPriceInfo?.volume24">
              {{ countFormat(coinPriceInfo.volume24) }}
            </div>
            <div class="itemR fw-num" v-else>
              {{ countFormat(tradeStore.klineTicker.volume || 0) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useTradeStore } from '@/store/trade'
import { countFormat, priceFormat } from '@/utils/decimal'
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store/index.js'
import { onMounted } from 'vue'
const mainStore = useMainStore()

const props = defineProps({
  coinInfo: {
    type: Object,
    default: () => {}
  }
})
const coinCollect = ref()
onMounted(() => {
  coinCollect.value = props.coinInfo.isCollect === 2 ? false : true
})
watch(
  () => props.coinInfo.coin,
  () => {
    coinCollect.value = props.coinInfo.isCollect === 2 ? false : true
  },
  { deep: true }
)
/**
 * 黄金白银取值
 */

const tradeStore = useTradeStore()
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[props.coinInfo.coin] || {}
})
const emits = defineEmits(['showSidePopup'])
// 点击收藏按钮
const setCollectByCoin = () => {}
</script>
<style lang="scss" scoped>
.hightItem {
  color: var(--ex-active-font-color) !important;
}
.top {
  padding: 20px 15px 0;
  z-index: 9;
  background-color: var(--ex-default-background-color);
  .first {
    display: flex;
    justify-content: space-between;
    .firLeft {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: var(--ex-default-font-color);
      .firLeftImg {
        width: 17px;
        height: 14px;
        margin-right: 10px;
      }
      .firNum {
        font-size: 14px;
        margin-left: 10px;
      }
    }
    .senLeftImg {
      margin-left: 10px;
      display: block;
      width: 24px;
      height: 24px;
    }
  }
  .second {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0 10px;
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
        justify-content: space-between;
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
  .third {
    margin-top: 20px;
    .list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .thirdLeft {
        display: flex;
        font-size: 14px;
        color: var(--ex-default-font-color);
        .item {
          margin-right: 30px;
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
}
.selectTimes {
  position: fixed;
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
</style>
