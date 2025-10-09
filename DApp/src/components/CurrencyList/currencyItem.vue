<template>
  <div class="currencyItem">
    <div class="left">
      <image-load :filePath="currencyItem.logo" class="leftImg" v-if="showLeftImg" />
      <div>
        <div class="topText ff-num">
          <div class="textTop fw-num">
            {{ currencyItem.showSymbol }}
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="rightLeft">
        <div class="fw-num">
          {{ priceFormat(tradeStore.allCoinPriceInfo[currencyItem.coin]?.close) }}
        </div>
      </div>
      <div class="rightBox">
        <div
          :class="[
            _isRFD(
              tradeStore.allCoinPriceInfo[currencyItem.coin]?.openPrice,
              tradeStore.allCoinPriceInfo[currencyItem.coin]?.close
            ),
            'rfd-sign rfd-bg rightRight fw-num'
          ]"
        >
          <span>{{ tradeStore.allCoinPriceInfo[currencyItem.coin]?.priceChangePercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useTradeStore } from '@/store/trade/index'
import { priceFormat } from '@/utils/decimal.js'
const tradeStore = useTradeStore()
const props = defineProps({
  currencyItem: {
    type: Object,
    default: {}
  },
  showLeftImg: {
    type: Boolean,
    default: true
  }
})
</script>
<style lang="scss" scoped>
.currencyItem {
  padding: 8px 15px;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .leftImg {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      border-radius: 100%;
    }
    .topText {
      display: flex;
      align-items: flex-end;
      font-size: 12px;
      color: var(--ex-font-color21);
      .textTop {
        color: var(--ex-font-color6);
        font-size: 14px;
      }
      .tip {
        margin-left: 5px;
        display: flex;
        align-items: center;
        padding: 5px;
        height: 15px;
        background: var(--ex-div-bgColor29);
        border-radius: 1px 1px 1px 1px;
        font-size: 12px;
        font-weight: 400;
        color: var(--ex-font-color9);
      }
    }
    .bottomText {
      margin-top: 4px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--ex-font-color21);
      .bottomTextNum {
        margin-left: 5px;
        color: #888888;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .rightLeft {
      color: var(--ex-default-font-color);
      text-align: right;
      font-size: 14px;
      .numRight {
        font-size: 12px;
        margin-top: 4px;
      }
    }
    .rightBox {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .rightRight {
        color: var(--ex-rfd-draw);
        background-color: var(--ex-rfd-draw-bg);
        max-width: 80px;
        min-width: 80px;
        height: 80%;
        margin-left: 20px;
        border-radius: 3px;
        padding: 12px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
    }
  }
}
</style>
