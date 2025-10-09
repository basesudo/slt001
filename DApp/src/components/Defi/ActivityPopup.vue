<!-- 活动弹窗 -->
<script setup>
import { priceFormat } from '@/utils/decimal.js'
import { updateDefiActivityApi } from '@/api/defi'
import { _toView } from '@/utils/public'
import { dict } from '@/api/common'
import { useDefiStore } from '@/store/defi/index'
const emits = defineEmits(['update:value'])
const defiStore = useDefiStore()
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {}
  }
})
const show = computed(() => props.value)

const close = () => {
  emits('update:value', false)
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
 * 已读
 */
const receive = async () => {
  await updateDefiActivityApi({ id: props.data.id, status: '1' })
  close()
  _toView('/defi')
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
  <div>
    <van-popup v-model:show="show" @close="close" :close-on-click-overlay="false">
      <div>
        <div class="title">
          <!-- 幸运活动 -->
          {{ _t18('defi_air_activity') }}
        </div>
        <div class="content">
          <div class="tit">
            <!-- 划分 -->
            {{ _t18('divide') }}
            {{ defiStore.divideBalance }} ETH
          </div>
          <div class="row">
            <!-- 当钱包余额达到  -->
            {{ _t18('when_wallet_balance_reaches') }}
            {{ priceFormat(props.data.totleAmount, 2) }} USDT，
            <!-- 您将获得 -->
            {{ _t18('you_will_receive') }}
            {{ priceFormat(props.data.amount) }}
            {{ coin }}
            <!-- 来自矿池中的奖励 -->
            {{ _t18('rewards_from_pool') }}
          </div>
        </div>
        <div class="footer">
          <div class="l">
            <div class="row">
              <!-- 接收有效时间 -->
              {{ _t18('receive_valid_time') }}
              ：{{ props.data.days }}
              <!-- 天 -->
              {{ _t18('day') }}
            </div>
            <div class="btn" @click="receive">
              <!-- 立即领取 -->
              {{ _t18('claim_immediately') }}
            </div>
          </div>
          <div class="r">
            <image-load filePath="defi/lucky.png"></image-load>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style lang="scss" scoped>
:deep(.van-popup) {
  width: 345px;
  border-radius: 10px;
  min-height: 370px;
  padding: 30px 15px 0;
  .title {
    font-size: 42px;
    text-align: center;
    font-family: 'RZRX';
    font-weight: 400;
    color: var(--ex-font-color9);
    line-height: 42px;
  }
  .content {
    margin-top: 15px;
    .tit {
      font-size: 20px;
      font-family: 'RZRX';
      font-weight: 400;
      color: var(--ex-font-color6);
      line-height: 32px;
      margin-bottom: 15px;
    }
  }
  .row {
    font-size: 14px;
    font-weight: 400;
    color: #4e4e4e;
    line-height: 28px;
  }
  .footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .l {
      .btn {
        margin-top: 30px;
        min-width: 126px;
        min-height: 35px;
        background: var(--ex-div-bgColor1);
        border-radius: 18px;

        font-size: 14px;
        font-weight: 400;
        color: var(--ex-font-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .r {
      min-width: 160px;
      margin-left: 10px;
      font-size: 160px;
    }
  }
}
</style>
