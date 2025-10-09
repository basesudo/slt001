<template>
  <div>
    <!-- 申购详情 -->
    <HeaderBar :currentName="_t18(`Apply_subscription`)"></HeaderBar>
    <!-- 币种介绍 -->
    <CoinInfo :data="formData"></CoinInfo>
    <!-- 认购数量 -->
    <div class="infoItem">
      <p class="title fw-bold">{{ _t18('Subscription_quantity') }}</p>
      <input
        type="number"
        class="numInput"
        :placeholder="_t18(`exchange.input`)"
        v-model="number"
      />
    </div>
    <div class="tip-list">
      <div class="row">
        <!-- 可购买数量 -->
        <div class="label">{{ _t18('available_quantity') }}</div>
        <div class="value">{{ formData.numLimit }} {{ formData.showSymbol }}</div>
      </div>
      <div class="row">
        <!-- 可用余额 -->
        <div class="label">{{ _t18('exchange_balance') }}</div>
        <div class="value">{{ availableBalance || 0 }} USDT</div>
      </div>
    </div>
    <!-- 产品详情 -->
    <div class="infoItem">
      <ProductInfo :data="formData"></ProductInfo>
    </div>
    <!-- 提交申购 -->
    <div class="infoItem btnBox" @click="submit">
      <ButtonBar :btnValue="_t18(`btnConfirm`)" />
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import HeaderBar from '@/components/HeaderBar/index.vue'
import CoinInfo from './components/CoinInfo.vue'
import ProductInfo from './components/ProductInfo.vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { getOwnCoinDetail, placing } from '@/api/subscription/index'
import { _mul } from '@/utils/decimal'
import { _toView } from '@/utils/public'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()

import { useUserStore } from '@/store/user/index'
const userStore = useUserStore()
userStore.getUserInfo()
const $router = useRouter()
const route = useRoute()

/**
 * 详情数据
 */
const formData = reactive({})
/**
 * id
 */
const id = ref('')
/**
 * 可用余额
 */
const availableBalance = computed(() => {
  let tempValue = 0
  if (userStore.asset.length) {
    tempValue = userStore.asset.filter((item) => item.symbol === 'usdt')[0]?.availableAmount || 0
  }
  return tempValue
})

const number = ref()

const submit = () => {
  let params = {
    userId: userStore.userInfo.user?.userId,
    ownId: formData.id,
    amount: _mul(formData?.price, number.value||0),
    number: number.value||0
  }
  if (!(number.value > 0 && number.value < formData.numLimit)) {
    // 请填写正确数量
    _toast('Please_ correct_quantity')
    return
  }
  placing(params).then((res) => {
    if (res.code == '200') {
      // 申购成功
      _toast('Subscription_successful')
      setTimeout(() => {
        $router.push('/subscription/order')
      }, 500)
    } else {
      showToast(res.msg)
    }
  })
}

/**
 * 获取数据详情
 */
const getDetail = async () => {
  if (id.value) {
    const res = await getOwnCoinDetail(id.value)
    if (res.code == 200) {
      Object.assign(formData, res.data)
    }
  }
}
onMounted(() => {
  id.value = route.query.id
  getDetail()
})
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-home-list-ftcolor2);
}
.tip-list {
  .row {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    .label {
    }
    .value {
    }
  }
}

.infoItem {
  border-top: 1px solid var(--ex-border-color);
  padding: 20px 15px;
  .title {
    font-size: 16px;
  }
  .numInput {
    margin-top: 15px;
    // border: 1px solid #ccc;
    border: 1px solid var(--ex-input-boder-bgColor);
    width: 100%;
    border-radius: 3px;
    padding: 10px;
  }
  .numInput::placeholder {
    // color: #c5c5c5;
    color: var(--ex-home-list-ftcolor2);
  }
}
.btnBox {
  padding-top: 50px;
}
</style>
