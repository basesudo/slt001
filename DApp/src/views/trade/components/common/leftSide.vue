<template>
  <div class="leftSide">
    <div class="leftSideHeader fw-bold">{{ _t18('quote') }}</div>
    <div class="search">
      <svg-load name="sousuo-h" class="searchImg"></svg-load>
      <div class="contain">
        <input
          type="text"
          v-model.trim="searchName"
          class="inputSearch"
          :placeholder="_t18('search_currency')"
          @input="searchBtn"
        />
      </div>
    </div>
    <Filter :list="currentCoinList" @toSort="toSort"></Filter>
    <div class="leftList">
      <div v-if="currentList.length">
        <CurrencyItem
          v-for="(item, index) in filterKeyCoin(currentList, searchName)"
          :key="index"
          :currencyItem="item"
          :showLeftImg="['fx'].includes(_getConfig('_APP_ENV')) ? true : false"
          @click="linkTo(item)"
        ></CurrencyItem>
      </div>
      <Nodata v-else></Nodata>
    </div>
  </div>
</template>

<script setup>
import Filter from './filter.vue'
import { filterKeyCoin } from '@/utils/filters'
import CurrencyItem from '@/components/CurrencyList/currencyItem.vue'
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
import { useTradeStore } from '@/store/trade'

const tradeStore = useTradeStore()
import { computed } from 'vue'
import { dispatchCustomEvent } from '@/utils'

import { useRouter, useRoute } from 'vue-router'
const $router = useRouter()
const $route = useRoute()
const props = defineProps({
  headerList: {
    type: Array
  }
})
/**
 * 搜索
 */
const searchName = ref('')
/**
 * 币种列表
 */
const currentList = ref([])
const currentCoinList = computed(() => {
  let tempList = []
  if ($route.query.type) {
    if ($route.query.type == 1) {
      tempList = tradeStore.spotCoinList
    } else if ($route.query.type == 2) {
      tempList = tradeStore.contractCoinList
    }
  } else {
    if ($route.path == '/tradeU') {
      tempList = tradeStore.contractCoinList
    } else if ($route.path == '/tradeBB') {
      tempList = tradeStore.spotCoinList
    } else {
      let temp = props.headerList[mainStore.tradeFlag]
      if (temp.currentTab == 'secondContract') {
        tempList = tradeStore.secondContractCoinList
      } else if (temp.currentTab == 'spot') {
        tempList = tradeStore.spotCoinList
      } else if (temp.currentTab == 'contract') {
        tempList = tradeStore.contractCoinList
      }
    }
  }

  currentList.value = tempList
  return tempList
})
/** 点击每一项 */
const emit = defineEmits(['linkTo', 'close'])
const linkTo = (item) => {
  let type = ''
  if ($route.query.type == 1) {
    type = 'spot'
  } else if ($route.query.type == 2) {
    type = 'contract'
  }
  if (!$route.query.type) {
    $router.replace(`${$route.path}?symbol=${item.coin}`)
  } else {
    $router.replace(`${$route.path}?symbol=${item.coin}&type=${$route.query.type}`)
  }
  dispatchCustomEvent('event_tradeSymbolChange', {
    type: type,
    symbol: item.symbol,
    coin: item.coin,
    coinInfo: item
  })

  emit('close')
  emit('linkTo', item.coin)
}
const toSort = (v) => {
  currentList.value = v
}
</script>

<style lang="scss" scoped>
.leftSide {
  .leftSideHeader {
    margin: 20px 15px 0;
    padding-top: 10px;
    font-size: 24px;
    font-weight: bold;
    color: var(--ex-default-font-color);
  }
  .search {
    margin: 30px 15px 15px;
    height: 46px;
    background: var(--ex-div-bgColor8);
    border-radius: 23px;
    display: flex;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    .searchImg {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    .contain {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: var(--ex-default-font-color);
      .inputSearch {
        flex: 1;
        background: var(--ex-div-bgColor8);
      }
      input::-webkit-input-placeholder {
        color: var(--ex-font-color5);
      }
      input::-moz-input-placeholder {
        color: var(--ex-font-color5);
      }
      input::-ms-input-placeholder {
        color: var(--ex-font-color5);
      }
    }
  }
}
</style>
