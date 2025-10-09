<!-- 合约历史 -->
<template>
  <div class="historyItem">
    <!-- tag看涨/看跌 -->
    <div class="header">
      <div class="name" :class="Number(itemHistroy.betContent) ? '' : 'hightOther'">
        {{
          Number(itemHistroy.betContent)
            ? _t18(`exchange_bullish`, ['bitmake'])
            : _t18(`exchange_bearish`, ['bitmake'])
        }}
      </div>
      <div class="fw-num">
        {{ _timeFormat(itemHistroy.params?.createTime, 'DD/MM/YYYY HH:mm', true) }}
      </div>
    </div>
    <div class="list">
      <div class="item">
        <div>
          {{
            itemHistroy.showCoin
              ? itemHistroy.showCoin
              : itemHistroy.coinSymbol.toUpperCase() + '/' + itemHistroy.baseSymbol.toUpperCase()
          }}
        </div>
        <div class="fw-num numItem">{{ itemHistroy.openPrice }}</div>
      </div>
      <!-- 数量 -->
      <div class="item">
        <div>{{ _t18(`metastaking_bb_count`) }}</div>
        <div class="fw-num numItem">{{ itemHistroy.betAmount }}</div>
      </div>
      <!-- 当前价 -->
      <div class="item" v-if="!currentEntruset">
        <div>{{ _t18(`option_now_price`) }}</div>
        <div class="fw-num numItem">
          {{ tradeStore.allCoinPriceInfo[itemHistroy.coinSymbol].close }}
          {{ itemHistroy.baseSymbol ? itemHistroy.baseSymbol.toUpperCase() : '' }}
        </div>
      </div>

      <!-- 时间 -->
      <div class="item">
        <div>{{ _t18(`k_time`) }}</div>
        <div class="fw-num numItem">{{ itemHistroy.type }}s</div>
      </div>

      <!-- 收盘时间 -->
      <div class="item" v-if="currentEntruset">
        <div>{{ _t18(`exchange.finashTime`) }}</div>
        <div class="fw-num numItem">
          <!-- {{ _timeFormat(itemHistroy.params?.closeTime, 'DD/MM/YYYY HH:mm:ss', true) }} -->
          {{ _timeFormat(itemHistroy.closeTime, 'DD/MM/YYYY HH:mm:ss', true) }}
        </div>
      </div>

      <!-- 收盘价 -->
      <div class="item" v-if="currentEntruset">
        <div>{{ _t18(`exchange.close`) }}</div>
        <div class="fw-num numItem">
          {{ itemHistroy.closePrice }}
          {{ itemHistroy.baseSymbol ? itemHistroy.baseSymbol.toUpperCase() : '' }}
        </div>
      </div>

      <!-- 盈亏 -->
      <!-- currentEntruset 0 当前  1 历史 -->
      <div class="item">
        <div>{{ _t18(`option_profit_loss_1`) }}</div>
        <!-- currentEntruset 0 当前  1 历史 -->
        <div
          v-if="currentEntruset"
          class="fw-num numItem"
          :class="profitAndlossColor(itemHistroy.betAmount, itemHistroy.rewardAmount)"
        >
          {{ profitAndloss(itemHistroy.betAmount, itemHistroy.rewardAmount) }}
          {{ itemHistroy.baseSymbol ? itemHistroy.baseSymbol.toUpperCase() : '' }}
        </div>
        <div
          v-if="!currentEntruset"
          class="fw-num numItem"
          :class="
            formatExpectedProfitColor(
              Number(itemHistroy.betContent),
              itemHistroy.openPrice,
              tradeStore.allCoinPriceInfo[itemHistroy.coinSymbol].close
            )
          "
        >
          {{
            formatExpectedProfit(
              Number(itemHistroy.betContent),
              itemHistroy.openPrice,
              tradeStore.allCoinPriceInfo[itemHistroy.coinSymbol].close,
              itemHistroy.betAmount,
              itemHistroy.rate
            )
          }}
          {{ itemHistroy.baseSymbol ? itemHistroy.baseSymbol.toUpperCase() : '' }}
        </div>
      </div>

      <!-- 倒计时 -->
      <div class="item" v-if="!currentEntruset">
        <div>{{ _t18(`option_countdown`) }}</div>
        <div class="fw-num numItem">
          {{ formatTime(countdown) }}
        </div>
      </div>

      <!-- 分享 -->
      <div class="item" v-if="currentEntruset && HISTORY_SNIPASTE.includes(_getConfig('_APP_ENV'))">
        <div></div>
        <div class="fw-num numItem">
          <p class="share-button" @click="sharedImg(itemHistroy)">{{ _t18(`trade_share`) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HISTORY_SNIPASTE } from '@/config/index'
import { _toFixed } from '@/utils/decimal'
import { formatTime } from '@/utils/filters'
import { _timeFormat } from '@/utils/public'
import { watchEffect, onMounted } from 'vue'
import { useTradeStore } from '@/store/trade/index'

import {
  formatExpectedProfit,
  formatExpectedProfitColor,
  profitAndloss,
  profitAndlossColor
} from '@/utils/filters'
import { _t18 } from '@/utils/public'

const tradeStore = useTradeStore()
const countdown = ref(-1)
const props = defineProps({
  itemHistroy: {
    type: Object,
    default: {}
  },
  currentEntruset: {
    type: Number,
    default: () => {
      return 0
    }
  }
})
const flag = ref(false)
const isUpdate = ref(false)
onMounted(() => {
  countdown.value = props.itemHistroy.time ? props.itemHistroy.time : 0
  flag.value = true
})
const emit = defineEmits(['recombine', 'updateRecord'])
watchEffect(() => {
  if (countdown.value >= 0) {
    isUpdate.value = true
    setTimeout(() => {
      countdown.value--
    }, 1000)
  } else {
    if (!props.currentEntruset && countdown.value !== 0 && flag.value) {
      emit('recombine', props.itemHistroy, countdown.value)
      if (isUpdate.value) {
        isUpdate.value = false
        emit('updateRecord')
      }
    }
  }
})

// 分享
const sharedImg = (model) => {
  console.log(model)
  emit('shareRevenue', model)
}
</script>
<style lang="scss" scoped>
.share-button {
  color: var(--ex-active-font-color);
  border: 1px solid var(--ex-active-font-color);
  border-radius: 3px;
  padding: 5px 10px;
}

.hightUp {
  color: var(--ex-font-color2) !important;
}

.hightDown {
  color: var(--ex-font-color10) !important;
}

.historyItem {
  padding: 20px 15px 0;
  border-bottom: 1px solid var(--ex-border-color);

  .colorBlue {
    color: var(--ex-font-color2) !important;
  }

  .header {
    padding-bottom: 20px;
    font-size: 14px;
    color: var(--ex-default-font-color);
    display: flex;
    align-items: center;

    .name {
      padding: 5px;
      font-size: 12px;
      background: var(--ex-div-bgColor1);
      border-radius: 2px 2px 2px 2px;
      margin-right: 10px;
      color: var(--ex-font-color);
    }

    .hightOther {
      background: var(--ex-div-bgColor16);
    }
  }

  .list {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--ex-passive-font-color);
      padding-bottom: 20px;

      .numItem {
        color: var(--ex-default-font-color);
      }
    }
  }
}
</style>
