<template>
  <div @click="toDetail(dataValue)">
    <div class="title">
      <div class="left">
        <svg-load name="card" class="usdt" v-if="dataValue.type == 'BANK'"></svg-load>
        <svg-load :name="filterCoin2(dataValue.coin)" class="usdt" v-else></svg-load>
        <div class="txt">
          {{ dataValue.type }}
        </div>
      </div>
      <div class="right"><svg-load name="jiantou" class="jiantou"></svg-load></div>
    </div>
    <div class="message">
      <div>
        <!-- 金额 -->
        <p class="left">
          {{
            ['paxpay', 'aams'].includes(_getConfig('_APP_ENV'))
              ? _t18('withdraw_money')
              : _t18('recharge_amount')
          }}
        </p>
        <p class="right fontBold fw-num">{{ priceFormat(dataValue.amount) }}</p>
      </div>

      <div v-if="['paxpay'].includes(_getConfig('_APP_ENV'))">
        <!-- 实际到账金额 -->
        <p class="left">{{ _t18('Actual_amount_received') }}</p>
        <p class="right ff-num">{{ dataValue.realAmount }}</p>
      </div>
      <div v-if="['paxpay'].includes(_getConfig('_APP_ENV'))">
        <!-- 手续费 -->
        <p class="left">{{ _t18('Deduction_fee') }}</p>
        <p class="right ff-num">{{ dataValue.fee }}</p>
      </div>

      <div>
        <!-- 状态 审核中 成功 失败 -->
        <p class="left">{{ _t18('recharge_status') }}</p>
        <p class="right status0" v-if="dataValue.status == 0">{{ _t18('recharge_waiting') }}</p>
        <p class="right status1" v-if="dataValue.status == 1">{{ _t18('recharge_tab_success') }}</p>
        <p class="right status2" v-if="dataValue.status == 2">{{ _t18('recharge_tab_error') }}</p>
      </div>

      <div>
        <!-- 时间 -->
        <p class="left">{{ _t18('recharge_time') }}</p>
        <p class="right ff-num">{{ _timeFormat(dataValue.params?.createTime) }}</p>
      </div>
      <div v-if="dataValue.rechargeRemark">
        <!-- 备注 -->
        <p class="left">{{ _t18('kind_tips') }}</p>
        <p class="right ff-num">{{ dataValue.rechargeRemark }}</p>
      </div>
      <div v-if="dataValue.withDrawRemark">
        <!-- 备注 -->
        <p class="left">{{ _t18('kind_tips') }}</p>
        <p class="right ff-num">{{ dataValue.withDrawRemark }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { _toView, filterCoin2 } from '@/utils/public'
import { priceFormat } from '@/utils/decimal'
const router = useRouter()
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})
const dataValue = computed(() => {
  return props.data
})
const toDetail = (data) => {
  // 充值0 提现1
  // console.log(router.currentRoute.value.name=='RechargOrder')
  // if (data.type == '0') {
  if (router.currentRoute.value.name == 'RechargOrder') {
    router.push({
      path: '/recharge-detail',
      // query: { data:encodeURI(JSON.stringify(data)) }
      query: { id: data.id }
    })
  } else if (router.currentRoute.value.name == 'WithdrawOrder') {
    router.push({
      path: '/withdraw-detail',
      query: { id: data.id }
    })
  }
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
div {
  background: var(--ex-default-background-color) !important;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .left {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      .usdt {
        font-size: 24px;
        margin-right: 10px;
      }
    }

    p {
      color: var(--ex-font-color9);
    }
    .jiantou {
      font-size: 10px;
    }
  }
  .message {
    & > div {
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        color: var(--ex-passive-font-color);
      }
      .fontBold {
        font-weight: bold;
        color: var(--ex-font-color10);
      }
      .status0 {
        color: var(--ex-font-color23);
      }
      .status1 {
        color: var(--ex-font-color9);
      }
      .status2 {
        color: var(--ex-font-color3);
      }
    }
  }
}
</style>
