<template>
  <div class="userAmount" v-if="$route.path.includes('recharge')">
    <p class="add ff-num">+{{ priceFormat(props.data?.amount || 0) }}</p>
    <!-- 充值金额 -->
    <span>{{ _t18('recharge_money') }}({{ props.data?.type || '' }})</span>
  </div>
  <div class="userAmount" v-if="$route.path.includes('withdraw')">
    <p class="reduce ff-num">-{{ priceFormat(props.data.amount || 0) }}</p>
    <!-- 提现金额 -->
    <span>{{ _t18('withdraw_money') }}({{ props.data?.type || '' }})</span>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { priceFormat } from '@/utils/decimal.js'
const props = defineProps({
  data: {
    type: Object
  },
  amount: {
    type: String
  },
  coin: {
    type: String,
    default: 'USDT'
  }
})
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.userAmount {
  // margin-top: 61px;
  padding: 50px 0;
  border-bottom: 1px solid var(--ex-border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-bottom: 15px;
    font-size: 50px;
    font-weight: bold;
  }
  p.add {
    color: var(--ex-font-color2);
  }
  p.reduce {
    color: var(--ex-font-color10);
  }
  span,
  i {
    font-size: 16px;
    color: var(--ex-passive-font-color);
  }
}
</style>
