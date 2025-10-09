<!-- 交易——>秒合约 -->
<template>
  <div>
    <!-- 头部 -->
    <SecondContractHeader
      :coinInfo="coinInfo"
      @showSidePopup="showSidePopup"
    ></SecondContractHeader>
    <!-- k线，委托数据 -->
    <SecondContractContent :coinInfo="coinInfo" ref="childComp"></SecondContractContent>
    <!-- 看涨看跌 -->
    <UpsAndDowns :coinInfo="coinInfo" @eventBusBrother="eventBusBrother"></UpsAndDowns>
    <!-- 左侧切换币种 -->
    <PublicPopup
      :show="sidePopup"
      @handelClose="sidePopup = false"
      :direction="`left`"
      :height="`100%`"
      :width="`80%`"
      :showHeader="false"
      :empty="false"
    >
      <template #emptyContentCustomize>
        <LeftSide @close="sidePopup = false" :headerList="headerList"></LeftSide>
      </template>
    </PublicPopup>
  </div>
</template>

<script setup>
import SecondContractHeader from './secondContract/header/index.vue' // 秒合约header部分
import SecondContractContent from './secondContract/content/index.vue' // 秒合约内容部分
import UpsAndDowns from './secondContract/content/upsAndDowns.vue' //涨跌
import PublicPopup from '@/components/Popup/public.vue'
import LeftSide from './common/leftSide.vue'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { setCollect, removeCollect } from '@/api/trade'
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
const $route = useRoute()
const props = defineProps({
  headerList: {
    type: Array
  }
})
/**
 * 币种信息
 */
// 当前币种信息
const coinInfo = ref({})
// 监听路由展示对应币种信息
watch(
  () => $route.query.symbol,
  (val) => {
    coinInfo.value = tradeStore.secondContractCoinList.filter((item, index) => {
      return item.coin === val
    })[0]
  },
  {
    deep: true
  }
)
// 初始化展示币种信息
const init = () => {
  if ($route.query.symbol) {
    coinInfo.value = tradeStore.secondContractCoinList.filter((item, index) => {
      return item.coin === $route.query.symbol
    })[0]
    if (!coinInfo.value) {
      coinInfo.value = tradeStore.secondContractCoinList[0]
    }
  } else {
    coinInfo.value = tradeStore.secondContractCoinList[0]
  }
}
onMounted(() => {
  init()
})
/**
 * 侧边栏
 */
const sidePopup = ref(false)
const showSidePopup = () => {
  sidePopup.value = true
}
/** 子调用兄弟更新委托列表 */
const childComp = ref(null)
const eventBusBrother = () => {
  userStore.getUserInfo()
  childComp.value.updateList()
}
</script>

<style lang="scss" scoped></style>
