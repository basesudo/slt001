<!-- 当前委托订单 -->
<script setup>
import { cancelOrderCurrencyApi } from '@/api/trade/index'
import { showToast } from 'vant'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { _t18 } from '@/utils/public'
import { useTradeStore } from '@/store/trade'
import { _add, _sub, _mul, _div, _toFixed, priceFormat } from '@/utils/decimal'
import { computed } from 'vue'
const tradeStore = useTradeStore()
const newPrice = computed(() => {
  return tradeStore.allCoinPriceInfo[props.data.symbol]?.close
})
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  coinInfo: {
    type: Object,
    default: () => {}
  }
})
/**
 * 取消订单
 */
const hide = ref(false)
const showChe = ref(true)
const emit = defineEmits(['reduceOrderNum'])
// 撤单
const cancelOrder = async () => {
  const res = await cancelOrderCurrencyApi(props.data.id)
  if (res.code == 200) {
    showToast(res.msg)
    showChe.value = false
    hide.value = true
    emit('reduceOrderNum')
  } else {
    showToast(res.msg)
  }
}
</script>
<template>
  <div class="hisToryList" v-if="!hide">
    <p>{{ data.index }}</p>
    <div class="header">
      <div class="headerLeft">
        <!-- 买 -->
        <div class="name" v-if="data.type == 0">{{ _t18(`buy`) }}</div>
        <!-- 卖 -->
        <div class="name name2" v-if="data.type == 1">{{ _t18(`sell`) }}</div>
        <div class="fw-bold">
          {{
            data.showCoin
              ? data.showCoin
              : data.symbol?.toUpperCase() + '/' + data.coin?.toUpperCase()
          }}
        </div>
      </div>
      <!-- 撤单 -->
      <div v-if="showChe && data.status == 0" class="headerRight" @click="cancelOrder">
        {{ _t18(`bb_Cancellation`) }}
      </div>
    </div>
    <div class="list">
      <!-- 时间 -->
      <div class="item">
        <div>{{ _t18(`k_time`) }}</div>
        <div class="fw-num numItem" v-if="data.delegateTime">
          {{ _timeFormat(data.params?.delegateTime, 'HH:mm MM/DD', true) }}
        </div>
      </div>
      <!-- 委托价 -->
      <div class="item">
        <div>{{ _t18(`bb_commission_price`) }}</div>
        <div class="fw-num numItem">{{ data.delegatePrice || 0 }}</div>
      </div>
      <!-- 委托量 -->
      <div class="item" v-if="!['rxce'].includes(_getConfig('_APP_ENV'))">
        <div>{{ _t18(`bb_commission_amount`) }}</div>
        <div class="fw-num numItem">{{ data.delegateTotal || 0 }}</div>
      </div>
      <!-- 数量 -->
      <div class="item">
        <div>{{ _t18(`metastaking_bb_count`) }}</div>
        <div class="fw-num numItem">{{ data.dealNum || 0 }}</div>
      </div>
      <!-- 成交价 ,rxce:最新价 -->
      <div class="item" v-if="['rxce'].includes(_getConfig('_APP_ENV')) && data.type === 0">
        <div>{{ _t18(`home_newPrice`) }}</div>
        <div class="fw-num numItem">{{ newPrice || 0 }}</div>
      </div>
      <div class="item" v-else>
        <div>{{ _t18(`home_turnover`) }}</div>
        <div class="fw-num numItem">{{ data.dealPrice || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.colorBlue {
  color: var(--ex-font-color9) !important;
}
.hisToryList {
  padding: 20px 15px 0;
  // border-bottom: 1px solid var(--ex-border-color);
  .header {
    padding-bottom: 20px;
    font-size: 14px;
    color: var(--ex-default-font-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .headerLeft {
      display: flex;
      align-items: center;
      .name {
        padding: 0 5px;
        font-size: 12px;
        background: var(--ex-div-bgColor1);
        border-radius: 2px 2px 2px 2px;
        margin-right: 10px;
        color: var(--ex-font-color);
      }
      .name2 {
        background: var(--ex-rfd-fall);
      }
    }
    .headerRight {
      padding: 0 5px;
      background: var(--ex-default-background-color);
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      border: 1px solid var(--ex-border-color4);
      font-size: 12px;
      color: var(--ex-font-color9);
    }
  }
  .list {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--ex-passive-font-color);
      padding-bottom: 15px;
      .numItem {
        color: var(--ex-default-font-color);
      }
      .numItemRed {
        color: var(--ex-font-color15);
      }
    }
  }
}
</style>
