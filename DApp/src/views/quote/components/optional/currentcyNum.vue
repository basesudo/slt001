<template>
  <div class="numList fw-num">
      <div class="numTop">
        {{ priceFormat(coinPriceInfo?.close) }}
      </div>
      <div
        :class="[
          _isRFD(coinPriceInfo?.openPrice, coinPriceInfo?.close, 'buy', 'rise'),
          ' rfd-sign numBot fw-num'
        ]"
      >
        {{ coinPriceInfo?.priceChangePercent }}%
      </div>
  </div>
</template>
<script setup>
import { priceFormat } from '@/utils/decimal.js'
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[props.data.coin] || {}
})
</script>
<style lang="scss" scoped>
.numList {
  display: flex;
  align-items: center;
  flex-direction: column;
  .numTop {
    margin-bottom: 2px;
    font-size: 14px;
    color: var(--ex-default-font-color);
  }
  .numBot {
    margin-top: 2px;
    font-size: 12px;
    color: var(--ex-font-color4);
  }
}
</style>
