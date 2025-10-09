<!-- 行情——>U本位 -->
<template>
  <div>
    <Filter :list="currentCoinList" @toSort="toSort" />
    <div v-if="currentList.length" class="currentCoinListStyle">
      <CurrencyItem
        v-for="(item, index) in filterKeyCoin(currentList, searchName)"
        :key="index"
        :currencyItem="item"
        @click="linkTo(item)"
      >
      </CurrencyItem>
    </div>
  </div>
</template>

<script setup>
import { filterKeyCoin } from '@/utils/filters'
import Filter from './common/filter.vue'
import CurrencyItem from '@/components/CurrencyList/currencyItem.vue'
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()
const props = defineProps({
  searchName: {
    type: String
  }
})
const currentCoinList = computed(() => {
  let tempList = tradeStore.contractCoinList
  return tempList
})
const currentList=ref(tradeStore.contractCoinList)
const toSort=(v)=>{
  currentList.value=v
}
import { useRouter } from 'vue-router'
const router = useRouter()
const linkTo=(item)=>{
  router.push(`/trade?symbol=${item.coin}`)
}
</script>

<style lang="scss" scoped>
.currentCoinListStyle {
  padding-bottom: 74px;
}
</style>
