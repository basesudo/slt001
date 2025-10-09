<template>
  <!-- 详情 -->
  <HeaderBar :currentName="_t18(`host.detail`)" />
  <DetailHeader :headerObj="headerObj"></DetailHeader>
  <div class="introduction">
    <!-- 基金介绍 -->
    <div class="title fw-bold">{{ _t18(`Fund_introduction`) }}</div>
    <!-- 暂无介绍 -->
    <div>{{ fundIntroduction ? fundIntroduction : _t18(`No_introductionyet`) }}</div>
  </div>
  <ProductDetail :proDetail="proDetail"></ProductDetail>
  <ProductRules :proRules="proRules"></ProductRules>
  <div class="buyNow">
    <!-- 立即购买 -->
    <div class="buyBtn" @click="buyNow">{{ _t18(`buy_it_now`) }}</div>
  </div>
</template>
<script setup>
import { DIFF_ISFREEZE_OTHER } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import HeaderBar from '@/components/HeaderBar/index.vue'
import DetailHeader from './components/detailHeader.vue' //头
import ProductDetail from './components/productDetail.vue' // 详情
import ProductRules from './components/productRules.vue' // 规则
import { financialDetail } from '@/api/financial/index'
import { _t18 } from '@/utils/public'
const $router = useRouter()
const Route = useRoute()
// 平均收益 项目周期（天） 起投金额
const headerObj = ref({
  leftName: _t18('average_income'),
  leftColor: '#DF163D',
  centerName: `${_t18('project_cycle')}(${_t18('ldgpt_host_day')})`,
  rightName: _t18(`starting-amount`)
})
const fundIntroduction = ref('') // 基金介绍
const proDetail = ref({}) // 产品详情
const proRules = ref('') // 产品规则
const buyNow = () => {
  if (DIFF_ISFREEZE_OTHER.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE_OTHER)) {
      $router.push(`/buyFunds/${Route.params.id}`)
    }
  } else {
    $router.push(`/buyFunds/${Route.params.id}`)
  }
}
/** 获取详情 */
const getDetail = async () => {
  try {
    const res = await financialDetail(Route.params.id)
    if (res.code === 200) {
      const { title, icon, avgRate, days, limitMin, coin, prodectIntroduction, problem } = res.data
      /**产品介绍 */
      fundIntroduction.value = prodectIntroduction
      headerObj.value = {
        title,
        icon,
        leftNum: avgRate + '%',
        centerNum: days,
        rightNum: limitMin + ' ' + coin.toUpperCase(),
        ...headerObj.value
      }
      /**产品详情 */
      const { process, totalInvestAmount, remainAmount, timeLimit } = res.data
      proDetail.value = {
        title,
        process,
        totalInvestAmount,
        remainAmount,
        timeLimit,
        avgRate,
        coin: coin.toUpperCase()
      }
      /**产品规则 */
      proRules.value = problem
    }
  } catch (error) {}
}
onMounted(() => {
  getDetail()
})
</script>
<style lang="scss" scoped>
.introduction {
  padding: 20px 17px;
  border-top: 1px solid var(--ex-border-color);
  border-bottom: 1px solid var(--ex-border-color);
  color: var(--ex-passive-font-color);
  font-size: 12px;
  .title {
    font-size: 16px;
    color: var(--ex-default-font-color);
    margin-bottom: 10px;
  }
}
.buyNow {
  padding: 50px 15px;
  .buyBtn {
    height: 50px;
    background: var(--ex-div-bgColor1);
    border-radius: 3px 3px 3px 3px;
    font-size: 16px;
    color: var(--ex-font-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
