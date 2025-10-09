<template>
  <div class="list" :class="showLeftImg ? 'listP' : 'listNormal'">
    <div
      v-for="(item, index) in coinList"
      :key="index"
      class="listItem"
      :class="showLeftImg ? 'itemP' : 'itemNormal'"
    >
      <LeftItem :showLeftImg="showLeftImg" :data="item"></LeftItem>
      <div class="center fw-num">
        <div>{{ tradeStore.allCoinPriceInfo[item.coin].close }}</div>
        <!-- <div class="centetBottom">-1.45%</div> -->
      </div>
      <div class="right">
        <div
          :class="[
            _isRFD(
              tradeStore.allCoinPriceInfo[item.coin].openPrice,
              tradeStore.allCoinPriceInfo[item.coin].close
            ),
            'rfd-bg rfd-sign rightNum fw-num'
          ]"
        >
          {{ tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import LeftItem from '@/components/CurrencyList/left.vue'
import { useTradeStore } from '@/store/trade'
const props = defineProps({
  showLeftImg: {
    type: Boolean,
    default: true
  },
  coinList: {
    type: Boolean,
    default: () => []
  }
})
const tradeStore = useTradeStore()
</script>
<style lang="scss" scoped>
.listP {
  padding: 4px 15px 66px !important;
}
.listNormal {
  padding: 0px 15px !important;
}
.itemP {
  padding: 14px 0 !important;
}
.itemNormal {
  padding: 10px 0 !important;
}
.list {
  .listItem {
    padding: 14px 0;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    .center {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: var(--ex-default-font-color);
      font-weight: 550;
      .centetBottom {
        margin-top: 6px;
        font-size: 12px;
        color: var(--ex-font-color4);
      }
    }
    .right {
      flex: 1;
      width: 80px;
      display: flex;
      justify-content: right;
      .rightNum {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 74px;
        height: 28px;
        font-size: 14px;
        font-weight: 500;
        color: var(--ex-font-color);
        background: var(--ex-div-bgColor7);
        border-radius: 2px;
      }
    }
  }
}
</style>
