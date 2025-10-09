<!-- 幸运活动 -->
<script setup>
import { dict } from '@/api/common'
import { updateDefiActivityApi } from '@/api/defi'
import { useDefiStore } from '@/store/defi'
import { useUserStore } from '@/store/user'
import { priceFormat } from '@/utils/decimal'
import { _t18 } from '@/utils/public'
import { onMounted } from 'vue'
const { userInfo } = useUserStore()
const defiStore = useDefiStore()
const emits = defineEmits(['getShowDefiActivity'])
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
/**
 * 接收
 */
const accept = async () => {
  const res = await updateDefiActivityApi({ id: props.data.id, status: '2' })
  if (res.code == 200) {
    emits('getShowDefiActivity')
  } else {
    showToast(res.msg)
  }
}
/**
 * defi 活动字典
 */
const defiActivityTypeList = ref([])
const getDefiActivityType = async () => {
  const res = await dict('defi_activity_type')
  if (res.code == 200) {
    defiActivityTypeList.value = res.data
  }
}
/**
 * 奖励币种
 */
const coin = computed(
  () => defiActivityTypeList.value.find((elem) => elem.dictValue == props.data?.type)?.dictLabel
)

onMounted(() => {
  getDefiActivityType()
})
</script>
<template>
  <!-- 幸运活动 -->
  <div class="lucky">
    <div class="title">{{ _t18('defi_air_activity') }}</div>
    <div class="box">
      <image-load filePath="defi/activity_lucky.png" class="img"></image-load>
      <div class="tit-box">
        <div class="num fw-num">{{ defiStore.divideBalance }} ETH</div>
        <!-- 矿池总金额 -->
        <div class="tit">{{ _t18('defi_Gesamtmenge_des Mining-Pools') }}</div>
      </div>
      <div class="conn">
        <div class="row">
          <div class="label">{{ _t18('defi_Brieftaschenguthaben') }}</div>
          <div class="value fw-num">{{ priceFormat(userInfo.appAddressInfo.usdt || 0) }} USDT</div>
        </div>
        <div class="row">
          <div class="label">{{ _t18('defi_Abholzeit') }}</div>
          <div class="value fw-num">{{ props.data.days }} {{ _t18('pledge_day') }}</div>
        </div>
        <div class="row">
          <div class="label">{{ _t18('defi_Prämienbetrag') }}</div>
          <div class="value fw-num">{{ priceFormat(props.data.amount) }} {{ coin }}</div>
        </div>
        <div class="row">
          <div class="label">{{ _t18('defi_Empfangszustand') }}</div>
          <div class="value">
            {{ _t18('defi_Wallet-Guthaben erreicht') }}
            <span class="fw-num">{{ priceFormat(props.data.totleAmount, 2) }} USDT</span>
          </div>
        </div>
        <div class="btn active" @click="accept">
          {{ _t18('defi_übernehmen') }}
          <span class="fw-num"> {{ priceFormat(props.data.amount) || '0.00' }} ETH</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.lucky {
  // margin-top: 15px;
  .title {
    font-size: 18px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: var(--ex-font-color6);
  }
  .box {
    margin-top: 10px;
    border: 1px solid var(--ex-border-color1);
    border-radius: 3px;
    position: relative;
    z-index: 0;

    .img {
      position: absolute;
      transform: rotate(-12deg);
      z-index: -1;
      top: 90px;
      right: 15px;
      font-size: 120px;
      object-fit: contain;
    }

    .tit-box {
      padding: 20px 15px;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .num {
        font-size: 24px;
        color: var(--ex-font-color9);
      }
      .tit {
        margin-top: 10px;
        font-size: 14px;
        color: var(--ex-passive-font-color);
      }
    }
    .conn {
      border-top: 1px solid var(--ex-input-boder-bgColor);
      padding: 20px 15px 30px;

      .row {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .label {
          color: var(--ex-passive-font-color);
          font-size: 14px;
        }
        .value {
          font-size: 14px;
          color: var(--ex-font-color6);
        }
      }
    }
    .btn {
      margin-top: 30px;
      height: 45px;
      background: var(--ex-div-bgColor3);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.active {
        background: var(--ex-div-bgColor1);
        color: var(--ex-font-color);
      }
    }
  }
}
</style>
