<!-- 交易页面：秒合约，币币交易，U本位 -->
<template>
  <div>
    <!-- tabs -->
    <van-sticky>
      <div class="headerList">
        <div class="left">
          <svg-load name="jiantou-z" class="leftImg" @click="_back()"></svg-load>
        </div>
        <div class="headerChoose">
          <van-tabs
            swipeable
            shrink
            :swipe-threshold="2"
            v-model:active="currentIndex"
            line-width="20"
            line-height="2"
            color="#17ac74"
            title-active-color="#17AC74"
            title-inactive-color="#5d626d"
          >
            <van-tab v-for="(item, index) in headerList" :key="index" :title="item.title">
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </van-sticky>
    <!-- tab -->
    <component
      :is="currentComponent"
      :headerList="headerList"
    ></component>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()
import { useRoute } from 'vue-router'
const $route = useRoute()
import { computed, onMounted } from 'vue'
import SecondContract from './components/tradeSecondContract.vue'
import BBTrading from './components/tradeBBTrading.vue'
import Ustandard from './components/tradeUstandard.vue'
// tabs
const headerList = computed(() => {
  let tempList = mainStore.getTradeHeaderList.filter((item, index) => {
    return item.componentName != 'Optional'
  })
  return tempList
})
const currentIndex = ref(
  mainStore.tradeFlag - mainStore.isOption < 0 ? 0 : mainStore.tradeFlag - mainStore.isOption
)
// 切换组件
const currentComponent = computed(() => {
  let temp = ''
  if (headerList.value[currentIndex.value].componentName == 'SecondContract') {
    temp = SecondContract
  }else if (headerList.value[currentIndex.value].componentName == 'BBTrading') {
    temp = BBTrading
  }else if (headerList.value[currentIndex.value].componentName == 'Ustandard') {
    temp = Ustandard
  }
  return temp
})
watch(
  currentIndex,
  (n) => {
    mainStore.setTradeFlag(n)
    tradeStore.getCoinList()
    /* if (headerList.value[n].componentName == 'SecondContract') {
      let temp={}
      if ($route.query.symbol) {
        temp = tradeStore.secondContractCoinList.filter((item, index) => {
          return item.coin === $route.query.symbol
        })[0]
        if (!temp) {
          temp = tradeStore.secondContractCoinList[0]
        }
      } else {
        temp = tradeStore.secondContractCoinList[0]
      }
      coinInfo2.value=temp
    } else if (headerList.value[currentIndex.value].componentName == 'BBTrading') {
      let temp={}
      if ($route.query.symbol) {
        temp = tradeStore.spotCoinList.filter((item, index) => {
          return item.coin === $route.query.symbol
        })[0]
        if (!temp) {
          temp = tradeStore.spotCoinList[0]
        }
      } else {
        temp = tradeStore.spotCoinList[0]
      }
      coinInfo2.value=temp
    } else if (headerList.value[currentIndex.value].componentName == 'Ustandard') {
      let temp={}
      if ($route.query.symbol) {
        temp = tradeStore.contractCoinList.filter((item, index) => {
          return item.coin === $route.query.symbol
        })[0]
        if (!temp) {
          temp = tradeStore.contractCoinList[0]
        }
      } else {
        temp = tradeStore.contractCoinList[0]
      }
      coinInfo2.value=temp
    } */
  },
  { immediate: true }
)
onMounted(()=>{
  tradeStore.getCoinList()
})
</script>

<style lang="scss" scoped>
.headerList {
  height: 60px;
  border-bottom: 1px solid var(--ex-border-color);
  display: flex;
  align-items: center;
  background: var(--ex-home-list-bgcolor);
  z-index: 9;
  padding-left: 15px;

  .left {
    display: flex;
    font-size: 16px;
    font-weight: normal;
    color: var(--ex-default-font-color);

    .leftImg {
      width: 16px;
      height: 12px;
      margin-right: 15px;
    }
  }

  .headerChoose {
    display: flex;
    padding: 0 15px 0 0;
    background: var(--ex-home-list-bgcolor);

    :deep(.van-tabs__wrap) {
      height: 59px;
    }

    :deep(.van-tabs__nav) {
      background: var(--ex-home-list-bgcolor);
    }

    :deep(.van-tab) {
      flex: none;
      font-size: 16px;
      margin-right: 30px;
      padding: 0;
      color: var(--ex-home-list-ftcolor) !important;
      background: var(--ex-home-list-bgcolor);
    }

    :deep(.van-tab--active) {
      font-weight: normal;
      color: var(--ex-home-list-ftcolor3) !important;
    }
  }
}
</style>
