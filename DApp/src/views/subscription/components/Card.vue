<template>
  <div class="cardBox">
    <!--申购标题-->
    <div class="cardTitle">
      <div class="fw-bold title">{{ data.showSymbol }}</div>
      <div class="right" v-if="data.status == '1' || null">{{ _t18('Preparation') }}</div>
      <div class="right btn" v-else-if="data.status == '2'" @click="toBuy">
        {{ _t18('Subscription_ren') }}
      </div>
      <div class="right" v-else-if="data.status == '3'">{{ _t18('In_over') }}</div>
    </div>

    <!--申购详情-->
    <div class="cardInfo">
      <div class="top">
        <div class="left">
          {{ _t18('Lock-up_period') }}：<span class="ff-num"
            >{{ _timeFormat(data.params.beginTime) || '' }} ~
            {{ _timeFormat(data.params.endTime) || '' }}</span
          >
        </div>
      </div>
      <div class="center">
        <van-progress
          :percentage="percentage"
          color="linear-gradient(to right, #7ad6b4, #17ac74)"
        />
      </div>
      <div class="bottom">
        <div class="left">
          <span class="ff-num">{{ data.raisedAmount || 0 }} {{ data.showSymbol }}</span> /
          {{ data.raisingAmount || 0 }}
          {{ data.showSymbol }}
        </div>
        <div class="right">{{ _t18('Remaining') }} {{ 100 - percentage }}%</div>
      </div>
    </div>

    <!--订阅按钮-->
    <div class="subscribe-button" v-if="data.status == 1">
      <van-button
        round
        class="button-subscribe-button"
        @click="btn_subscription(data)"
        color="#17ac74"
        :disabled="disableBtn == 1"
      >
        {{ disableBtn == 1 ? _t18('subscribed') : _t18('subscription') }}
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { _t18, _toView } from '@/utils/public'
import { _div, _sub, _add, _mul, _toFixed } from '@/utils/decimal.js'
import { _timeFormat } from '@/utils/public'
import { useRouter } from 'vue-router'
import { subscribeCoins } from '@/api/subscription/index.js'
import { useUserStore } from '@/store/user'
import { Dialog, showDialog, showToast, Toast } from 'vant'
import { onMounted } from 'vue'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
const disableBtn = ref(0)
// 申购订阅
const btn_subscription = (model) => {
  // 用户信息
  const useStore = useUserStore()
  const userInfo = useStore.userInfo

  const params = {
    userId: userInfo.user.userId, //用户
    ownId: model.id, //订阅币种ID
    ownCoin: model.showSymbol, //币种名称
    price: model.price //初始单价
  }

  subscribeCoins(params).then((res) => {
    disableBtn.value = 1
    showDialog({
      message: res.msg
    })
  })
}

const props = defineProps({
  data: {
    type: Object
  }
})
onMounted(() => {
  disableBtn.value = props.data.params.sub_status
})
const percentage = computed(() => {
  return _toFixed(_mul(_div(props.data.raisedAmount, props.data.raisingAmount), 100), 2)
})
const toBuy = () => {
  if (props.data.params?.sub_status == '2' || props.data.params?.sub_status == '3') {
    _toView(`/subscription/info?id=${props.data.id}`)
  } else {
    // 未订阅不可申购
    _toast('cannot_subscribe')
  }
}
</script>

<style lang="scss" scoped>
* {
  font-size: 12px;
  // color: #333;
  color: var(--ex-home-list-ftcolor2);
}

.cardBox {
  // box-shadow: 0px 1px 10px 1px rgba(5, 5, 5, .2);
  box-shadow: 0px 1px 10px 1px var(--ex-shadow-back-color);
  margin: 20px 15px;
  padding: 0 10px;
  border-radius: 5px;

  //订阅按钮
  .subscribe-button {
    text-align: center;
    padding-bottom: 0.7rem;

    .button-subscribe-button {
      display: block;
      margin: 0 auto;
      font-size: 0.2rem;
      font-weight: bold;
      color: #ffffff;
      height: 0.9rem;
      padding: 0 2.5rem 0 2.5rem;
    }
  }

  .cardTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--ex-border-color);

    .title {
      font-size: 16px;
      padding: 15px 0;
    }

    .right {
      border: 1px solid #e1e1e1;
      padding: 5px 20px;
      border-radius: 15px;
    }

    .right.btn {
      border: 1px solid #17ac74;
      color: #17ac74;
    }
  }

  .cardInfo {
    .top {
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        // color: #a1a1a1;
        color: var(--ex-home-list-ftcolor2);
      }
    }

    .bottom {
      padding: 15px 0px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        // color: #a1a1a1;
        color: var(--ex-home-list-ftcolor2);
      }

      .right {
        // color: #a1a1a1;
        color: var(--ex-home-list-ftcolor2);
      }
    }
  }
}
</style>
