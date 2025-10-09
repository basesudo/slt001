<script setup>
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()
import { _t18 } from '@/utils/public'
import { pledgeSubmit } from '@/api/pledge/index'
import { priceFormat } from '@/utils/decimal.js'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()

const route = useRoute()
const router = useRouter()
const data = reactive(JSON.parse(decodeURI(route.query.data)))
/**
 * 账户信息
 */
const userStore = useUserStore()
const { asset } = storeToRefs(userStore)
const amount = computed(() => {
  // let data = 999
  let data = asset.value.filter((item, index) => {
    return item.type == '1' && item.symbol == 'usdt'
  })[0].availableAmount
  return data
})
const maxAmount = ref('')
let maxNum = () => {
  maxAmount.value = amount.value
}
const submitForm = () => {
  let params = { planId: data.id, amount: maxAmount.value }
  if (maxAmount.value == '' || maxAmount.value > data.limitMax || maxAmount.value < data.limitMin) {
    // showToast('购买金额有误')
    _toast('pledge_buy_error')
    return
  }
  pledgeSubmit(params).then((res) => {
    if (res.code == '200') {
      // showToast(res.msg)购买成功
      _toast('Purchase_successful')
      setTimeout(() => {
        router.push('/pledge/pledgeOrder')
      }, 500)
    } else {
      showToast(res.msg)
    }
  })
}
const submit = () => {
  if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE)) {
      submitForm()
    }
  } else {
    submitForm()
  }
}
</script>
<template>
  <HeaderBar :currentName="_t18('host.detail')"></HeaderBar>
  <!-- 申购金额 -->
  <div class="content1">
    <div class="jine">
      <!-- 申购金额存入资金 -->
      <div>
        <div>{{ _t18('pledge_Subscription_amount') }} <span>(USDT)</span></div>
        <p @click="$router.push('/recharge')">{{ _t18('pledge_deposit_funds') }}</p>
      </div>
      <div class="ipt">
        <input
          v-model="maxAmount"
          type="number"
          :placeholder="`${_t18('pledge_purchasing_price', ['aams'])}`"
          class="ff-num"
        />
        <p @click="maxNum()">{{ _t18('pledge_maximum') }}</p>
      </div>
    </div>
    <div class="shouyi">
      <div>
        <p>{{ _t18('pledge_quota') }}</p>
        <p class="ff-num">{{ data.limitMin }}~{{ data.limitMax }}</p>
      </div>
      <!-- 日收益率 -->
      <div>
        <p>{{ _t18('host_dailyrateof_return') }}</p>
        <p class="ff-num">{{ data.minOdds }}%~{{ data.maxOdds }}%</p>
      </div>
      <!-- 周期(天) -->
      <div>
        <p>{{ _t18('pledge_cycle') }}({{ _t18('pledge_day') }})</p>
        <p class="ff-num">{{ data.days }}</p>
      </div>
    </div>
  </div>
  <!-- 信息 -->
  <div class="content2">
    <div>
      <!-- 可用余额 -->
      <div>
        <div class="left">{{ _t18('pledge_Available_Balance') }}</div>
        <div class="right ff-num">{{ priceFormat(amount) }} USDT</div>
      </div>
      <!-- 可购次数 -->
      <div>
        <div class="left">{{ _t18('pledge_Available_times') }}</div>
        <div class="right ff-num" v-if="['dev'].includes(_getConfig('_APP_ENV'))">{{ `${data.buyPurchase}/${data.timeLimit}` }}</div>
        <div class="right ff-num" v-else>{{ `${data.timeLimit}` }}</div>
      </div>
      <!-- <div>
        <div class="left">总年化率</div>
        <div class="right ff-num">0.00%-0.00%</div>
      </div> -->
    </div>
    <!-- <div class="btn" @click="$router.push('/pledge/pledgeOrder')">确定</div> -->
    <div class="btn" @click="submit">{{ _t18('btnConfirm', ['bitmake']) }}</div>
  </div>
</template>
<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.content1 {
  border-bottom: 1px solid var(--ex-border-color);
  padding: 20px 15px 30px;
  .jine {
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: var(--ex-passive-font-color);
      }
      p {
        color: var(--ex-font-color9);
      }
    }
    .ipt {
      border: 1px solid var(--ex-border-color1);
      border-radius: 3px 3px 3px 3px;
      padding: 15px 10px;
      margin: 10px 0;
      input::placeholder {
        color: var(--ex-font-color5);
        background: var(--ex-default-background-color);
      }
    }
  }
  .shouyi {
    padding: 20px 0 0;
    display: flex;
    justify-content: center;
    & > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      & > p:first-child {
        margin-bottom: 12px;
        color: var(--ex-passive-font-color);
      }
      & > p:last-child {
        font-weight: 500;
      }
      &:first-child {
        align-items: flex-start;
      }
      &:last-child {
        align-items: flex-end;
      }
    }
  }
}
.content2 {
  padding: 30px 15px;
  & > div {
    & > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      .left {
        color: var(--ex-passive-font-color);
      }
      .right {
        font-weight: 500;
      }
    }
  }
  .btn {
    background-color: var(--ex-div-bgColor1);
    color: var(--ex-font-color);
    text-align: center;
    padding: 14px 0;
    font-size: 16px;
    border-radius: 3px;
  }
}
</style>
