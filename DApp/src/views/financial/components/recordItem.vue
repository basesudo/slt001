<template>
  <div class="recordItem">
    <!-- 基金名称 -->
    <div class="item">
      <div>{{ _t18(`fund_name`) }}</div>
      <div class="itemRight">{{ itemObj.planTitle }}</div>
    </div>
    <!-- 锁仓天数 -->
    <div class="item">
      <div>{{ _t18(`Lock-up_days`) }}</div>
      <div class="itemRight fw-num">{{ itemObj.days }}</div>
    </div>
    <!-- 日收益率 -->
    <div class="item">
      <div>{{ _t18(`host_dailyrateof_return`) }}</div>
      <div class="itemRight fw-num">{{ itemObj.avgRate }}%</div>
    </div>
    <!-- 投入金额 -->
    <!-- <div class="item">
      <div>{{ _t18(`investment_amount`) }}</div>
      <div class="itemRight fw-num">
        {{ itemObj.amount }} {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
      </div>
    </div> -->
    <!-- 预估收益 -->
    <div class="item">
      <div>{{ _t18(`Estimated income`) }}</div>
      <div class="itemRight fw-num">
        <!-- 预估收益 -->
        {{ priceFormat((itemObj.amount * itemObj.days * itemObj.avgRate) / 100, 6) }}
        {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
      </div>
    </div>
    <!-- 到账时间 -->
    <div class="item">
      <div>{{ _t18(`Arrival_time`) }}</div>
      <div class="itemRight fw-num">
        {{ timeOfreceipt(itemObj.settlementType, itemObj.days, itemObj.params.createTime) }}
      </div>
    </div>
    <!-- 状态 -->
    <div class="item">
      <div>{{ _t18(`mining_status`) }}</div>
      <div class="itemRight fw-num" :style="{ color: investmentStatus(itemObj.status).color }">
        {{ investmentStatus(itemObj.status).name }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { timeOfreceipt, investmentStatus } from '@/utils/filters'
import { priceFormat } from '@/utils/decimal'
import { _t18 } from '@/utils/public'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})
</script>
<style lang="scss" scoped>
.recordItem {
  padding: 30px 15px 20px;
  border-bottom: 1px solid var(--ex-border-color);
  .item {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--ex-passive-font-color);
    .itemRight {
      font-size: 12px;
      color: var(--ex-default-font-color);
    }
  }
}
</style>
