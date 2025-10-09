<!--
 * @Autor: Aka
 * @Date: 2023-06-30 17:28:36
 * @Description: 
 * @LastEditTime: 2023-08-22 10:43:44
-->
<!-- 合约规则 -->
<template>
  <HeaderBar :currentName="currentName" />
  <div class="itemDetailObj" v-html="currentHtml"></div>
  <Nodata v-if="!currentHtml"></Nodata>
</template>
<script setup>
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
import { computed, onMounted, ref } from 'vue'
import { rulesList } from '@/api/common/index'
import { useRoute } from 'vue-router'
import { _t18 } from '@/utils/public'
onMounted(()=>{
  mainStore.setTradeFlag(mainStore.tradeFlag + mainStore.isOption)
})
const $route = useRoute()
const currentName2 = computed(() => {
  switch (Number($route.query.type)) {
    case 0:
      // 秒合约规则
      return _t18(`Second_Contract_Rules`)
    case 1:
      // 币币交易规则
      return _t18(`Currency_Trading_Rules`)
    case 2:
      // U本位合约规则
      return _t18(`Ustandard_contract_rules`)
    default:
      // 秒合约规则
      return _t18(`Second_Contract_Rules`)
  }
})
const currentName = ref(currentName2.value)

const currentHtml = ref(null)
const getList = async (type) => {
  try {
    const res = await rulesList(type)
    if (res.code === 200) {
      currentHtml.value = res.data[0].content
      currentName.value=res.data[0].title||currentName2.value
    }
  } catch (error) {}
}
onMounted(() => {
  // 0 秒合约 1 币币 2 U本位
  switch (Number($route.query.type)) {
    case 0:
      getList('PERIOD_EXPLAIN')
      break
    case 1:
      getList('COIN_EXPLAIN')
      break
    case 2:
      getList('U_STANDARD_EXPLAIN')
      break
    default:
      break
  }
})
</script>
<style lang="scss" scoped>
.itemDetailObj {
  font-size: 12px;
  padding: 10px 15px;
  color: var(--ex-default-font-color);
  line-height: 24px;
  word-wrap: break-word;
}
.itemDetailObj img {
  width: 100%;
}
</style>
