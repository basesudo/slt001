<script setup>
import { _t18 } from '@/utils/public'
import { onMounted } from 'vue'
import { _mul } from '@/utils/decimal'

const props = defineProps({
  dataList: {
    type: Object,
    default: {}
  }
})
const status = computed(() => {
  // 待审核，审核通过，审核失败，已结清，已逾期
  let temp = ''
  if (props.dataList.status == 0) {
    temp = _t18('loan_apply_wait')
  } else if (props.dataList.status == 1) {
    temp = _t18('loan_apply_success')
  } else if (props.dataList.status == 2) {
    temp = _t18('loan_apply_err')
  } else if (props.dataList.status == 3) {
    temp = _t18('loan_apply_complete')
  } else if (props.dataList.status == 4) {
    temp = _t18('loan_apply_overdue')
  }
  return temp
})
onMounted(() => {
  console.log(props.dataList, 'dataListdataListdataList')
})
</script>
<template>
  <div class="loan-detail">
    <div class="item">
      <!-- 借款金额 -->
      <div class="left">{{ _t18('loan_amount') }}</div>
      <div class="right">{{ props.dataList.amount }}</div>
    </div>
    <div class="item">
      <!-- 状态 -->
      <div class="left">{{ _t18('loan_status') }}</div>
      <div class="right">{{ status }}</div>
    </div>
    <div class="item">
      <!-- 还款周期 -->
      <div class="left">{{ _t18('loan_cycle') }}</div>
      <div class="right">{{ props.dataList.cycleType }}</div>
    </div>
    <div class="item">
      <!-- 日利率 -->
      <div class="left">{{ _t18('loan_rateDay') }}</div>
      <div class="right">{{ props.dataList.rate }}%</div>
    </div>
    <div class="item">
      <!-- 利息 -->
      <div class="left">{{ _t18('loan_interest') }}</div>
      <div class="right">
        {{ _mul(_mul(_mul(dataList.amount, dataList.rate), dataList.cycleType), 0.01) }}
      </div>
    </div>
    <div class="item">
      <!-- 还款方式 -->
      <div class="left">{{ _t18('loan_repayType') }}</div>
      <div class="right">{{ dataList.repayTypeLabel }}</div>
    </div>
    <div class="item" v-if="!(dataList.status === 0 || dataList.status === 2)">
      <!-- 还款时间 -->
      <div class="left">{{ _t18('loan_time') }}</div>
      <div class="right">
        {{ _timeFormat(dataList.params?.finalRepayTime, 'HH:mm MM/DD', true) }}
      </div>
    </div>
    <div class="item">
      <!-- 借款机构 -->
      <div class="left">{{ _t18('loan_repayOrg') }}</div>
      <div class="right">{{ dataList.tloadProduct?.repayOrg }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loan-detail {
  // border-top: 1px solid var(--ex-border-color);
  // border-bottom: 1px solid var(--ex-border-color);
  .item {
    margin: 30px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-size: 14px;
      color: var(--ex-passive-font-color);
    }
    .right {
      font-size: 14px;
      color: var(--ex-default-font-color);
    }
  }
}
</style>
