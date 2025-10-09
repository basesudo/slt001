<template>
  <div>
    <div class="title">
      <div class="left">
        <svg-load name="usdt" class="usdt"></svg-load>
        <div class="txt">
          {{ dataValue.planTitle }}
        </div>
      </div>
    </div>
    <div class="message">
      <!-- 投资金额 -->
      <div>
        <p class="left">{{ _t18('pledge_investment_amount') }}</p>
        <p class="right fontBold ff-num">{{ priceFormat(dataValue.amount) }}</p>
      </div>
      <!-- 状态 -->
      <div>
        <p class="left">{{ _t18('recharge_status') }}</p>
        <p class="right status0" v-if="status == 0">{{ _t18('pledge_in_progress') }}</p>
        <p class="right status1" v-if="status == 1">{{ _t18('pledge_completed') }}</p>
        <p class="right status2" v-if="status == 2">{{ _t18('pledge_redeem_ok') }}</p>
      </div>
      <!-- 日收益率 -->
      <div>
        <p class="left">{{ _t18('host_dailyrateof_return') }}</p>
        <p class="right fontBold ff-num">{{ dataValue.minOdds }}%~{{ dataValue.maxOdds }}%</p>
      </div>
      <!-- 周期 -->
      <div>
        <p class="left">{{ _t18('pledge_cycle') }}</p>
        <p class="right fontBold ff-num">{{ dataValue.days }}({{ _t18('pledge_day') }})</p>
      </div>
      <!-- 开始日期 -->
      <div>
        <p class="left">{{ _t18('pledge_start_date') }}</p>
        <p class="right ff-num">{{ _timeFormat(dataValue.params?.createTime) }}</p>
      </div>
      <!-- 结束日期 -->
      <div>
        <p class="left">{{ _t18('pledge_end_date') }}</p>
        <p class="right ff-num">{{ _timeFormat(dataValue.params?.endTime) }}</p>
      </div>
      <!-- 赎回 -->
      <div v-if="status == 0 && !DIFF_HIDE_REDEEM.includes(_getConfig('_APP_ENV'))">
        <div class="btn" @click="submit">{{ _t18('host.redeem', ['aams']) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DIFF_HIDE_REDEEM } from '@/config/index'
import { priceFormat } from '@/utils/decimal.js'
import { redemption, redempNewtion } from '@/api/pledge/index'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
import { showToast } from 'vant'
const { _toast } = useToast()
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['getList'])
const dataValue = computed(() => {
  return props.data
})
const status = computed(() => {
  return props.data.status
})
const submit = () => {
  let params = { id: props.data.id }
  console.log(params)
  if (['trustwallet'].includes(__config._APP_ENV)) {
    redempNewtion(params).then((res) => {
      if (res.code == '200') {
        status.value = 2
        _toast('transfer_success')
        setTimeout(() => {
          emit('getList')
        }, 500)
      } else {
        showToast(res.msg)
      }
    })
  } else {
    redemption(params).then((res) => {
      if (res.code == '200') {
        status.value = 2
        _toast('transfer_success')
        setTimeout(() => {
          emit('getList')
        }, 500)
      } else {
        showToast(res.msg)
      }
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
      }
      .status0 {
        color: var(--ex-font-color23);
      }
      .status1 {
        color: var(--ex-font-color9);
      }
    }
  }
  .btn {
    width: 100%;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--ex-div-bgColor1);
    color: var(--ex-font-color);
    border-radius: 0.08rem;
  }
}
</style>
