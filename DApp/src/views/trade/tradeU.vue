<!-- 交易——>U本位 -->
<template>
  <div>
    <HeaderBar
      :currentName="_t18('trade_tab5', ['paxpay', 'latcoin'])"
      :border_bottom="true"
    ></HeaderBar>
    <!-- 头部 -->
    <UTradingHeader
      :coinInfo="coinInfo"
      @showSidePopup="showSidePopup"
    ></UTradingHeader>
    <!-- 主体内容 -->
    <UTradingContent :coinInfo="coinInfo"></UTradingContent>

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
import UTradingHeader from './components/ustandard/header/index.vue' // U本位header部分
import UTradingContent from './components/ustandard/content/index.vue' // U本位content部分
import PublicPopup from '@/components/Popup/public.vue'
import LeftSide from './components/common/leftSide.vue'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { setCollect, removeCollect } from '@/api/trade'
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()
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
    coinInfo.value = tradeStore.contractCoinList.filter((item, index) => {
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
    coinInfo.value = tradeStore.contractCoinList.filter((item, index) => {
      return item.coin === $route.query.symbol
    })[0]
    if (!coinInfo.value) {
      coinInfo.value = tradeStore.contractCoinList[0]
    }
  } else {
    coinInfo.value = tradeStore.contractCoinList[0]
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

</script>

<style lang="scss" scoped></style>
