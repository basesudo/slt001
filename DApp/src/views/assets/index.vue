<template>
  <div>
    <van-tabs
      shrink
      v-model:active="tabActive"
      title-inactive-color="#333"
      title-active-color="#17AC74"
      color="#17AC74"
      line-width="16"
      @click-tab="clickTab"
    >
      <van-tab
        v-for="(item, index) in tabList"
        :title="item.keyStr"
        :key="index"
        :name="item.name"
      ></van-tab>
    </van-tabs>

    <!-- 平台资产 platAccount-->
    <Plat
      v-show="tabActive == '平台资产'"
      :amountSum="amountSum"
      :assetDetails="assetDetails"
      @handleYanjin="handleYanjin"
      @handleShuaxin="handleShuaxin"
      :showNum="showNum"
      :type="tabActive"
    ></Plat>
    <!-- 理财资产 financAccount-->
    <financ
      v-show="tabActive == '理财资产'"
      :amountSum="amountSum"
      :assetDetails="assetDetails"
      @handleYanjin="handleYanjin"
      @handleShuaxin="handleShuaxin"
      :showNum="showNum"
      :type="tabActive"
    ></financ>
    <!-- 合约资产 contarctAccount-->
    <Contarct
      v-show="tabActive == '合约资产'"
      :amountSum="amountSum"
      :assetDetails="assetDetails"
      @handleYanjin="handleYanjin"
      @handleShuaxin="handleShuaxin"
      :showNum="showNum"
      :type="tabActive"
    ></Contarct>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { _add } from '@/utils/decimal'
import Plat from './components/account/platAccount.vue'
import financ from './components/account/financAccount.vue'
import Contarct from './components/account/contarctAccount.vue'
import { priceFormat, countFormat, currencyFormat } from '@/utils/decimal.js'
import { useUserStore } from '@/store/user/index'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { storageDict } from '@/config/dict'
import { showLoadingToast } from 'vant'
import { getFreezeList } from '@/api/user'
import { onMounted } from 'vue'
import { DIFF_FREEZE_ASSETS } from '@/config/index'

const userStore = useUserStore()
// 平台资产,理财资产,合约资产
const mainStore = useMainStore()

// tabs数据示例
// const tabList = [
//    {name: '平台资产', isOpen: true, sort: 0, keyStr: 'asset_platform'}
//    {name: '理财资产', isOpen: true, sort: 1, keyStr: 'asset_financ'}
//    {name: '合约资产', isOpen: true, sort: 2, keyStr: 'asset_contarct'}
// ]

const tabList = computed(() => {
  const list = mainStore.getAssetsTabList.filter((item) => {
    if (!item.isOpen) return false
    item.name == '平台资产' && (item.keyStr = _t18(item.keyStr, ['latcoin']))
    item.name == '理财资产' && (item.keyStr = _t18(item.keyStr, ['paxpay', 'latcoin']))
    item.name == '合约资产' && (item.keyStr = _t18(item.keyStr, ['paxpay', 'latcoin']))
    return true
  })
  return list.sort((a, b) => a.sort - b.sort)
})

console.log(tabList.value)

const tabActive = ref(tabList.value[0]?.name || '')

/**
 * 账户信息
 */
const curIndex = ref('0')
const clickTab = (e) => {
  if (curIndex.value != e.name) {
    userStore.getUserInfo()
    curIndex.value = e.name
  }
}

const showNum = ref(localStorage.getItem(storageDict.EYES) == 'true' || true)
// 点击小眼睛
const handleYanjin = () => {
  showNum.value = !showNum.value
  localStorage.setItem(storageDict.EYES, showNum.value)
}

// 点击刷新
const handleShuaxin = () => {
  showLoadingToast({
    forbidClick: true,
    duration: 0
  })
  userStore.getUserInfo()
  getAccountFreezeList()
}

// 用户余额信息
const { asset } = storeToRefs(userStore)
const assetDetails = computed(() => {
  let list = []
  //[{icon: 'usdt', title: 'USDT', keyong: 100, zhanyong: 100, zhehe: 100}]
  asset.value.forEach((item, index) => {
    // 之前两块多平台判断逻辑是一样的 -> 精简合并

    if (
      (item.type == 1 && tabActive.value == '平台资产') ||
      (item.type == 2 && tabActive.value == '理财资产') ||
      (item.type == 3 && tabActive.value == '合约资产')
    ) {
      let obj = {}
      obj['keyong'] = priceFormat(item.availableAmount)
      // rxce冻结金额=占用+冻结
      if (DIFF_FREEZE_ASSETS.includes(__config._APP_ENV)) {
        let temp = 0
        if (freezeList.value) {
          freezeList.value.forEach((itm, inx) => {
            if (itm.coin == item.symbol && item.type == 1) {
              temp = itm.price
            }
          })
        }
        obj['zhanyong'] = priceFormat(_add(item.occupiedAmount, temp))
      } else {
        obj['zhanyong'] = priceFormat(item.occupiedAmount)
      }
      obj['zhehe'] = priceFormat(item.exchageAmount)
      if (item.symbol == 'usdt') {
        obj['icon'] = 'usdt'
        obj['loge'] = item.loge
        obj['title'] = 'USDT'
        list.unshift(obj)
      } else {
        obj['loge'] = item.loge
        obj['title'] = item.symbol?.replace('usdt', '').trim().toLocaleUpperCase()
        obj['icon'] = item.symbol?.replace('usdt', '').trim()
        list.push(obj)
      }
    }
  })
  return list
})

// 计算账户余额
const amountSum = computed(() => {
  let sum = 0
  for (let i = 0; i < assetDetails.value.length; i++) {
    sum += Number(assetDetails.value[i].zhehe)
  }
  return priceFormat(sum)
})

const freezeList = ref()

// 获取冻结资产
const getAccountFreezeList = async () => {
  if (DIFF_FREEZE_ASSETS.includes(__config._APP_ENV)) {
    const res = await getFreezeList()
    if (res.code == '200') {
      freezeList.value = res.data
    }
  }
}

onMounted(() => {
  getAccountFreezeList()
})
</script>

<style lang="scss" scoped>
:deep(.van-tabs__wrap) {
  height: 60px;
  // font-family: PingFang SC-Bold, PingFang SC;
  border-bottom: 1px solid var(--ex-border-color);
  background: var(--ex-home-list-bgcolor) !important;

  .van-tab__text {
    font-size: 16px;
    font-weight: normal;
  }

  .van-tab--shrink {
    margin-right: 20px;
  }
}

:deep(.van-tabs__nav) {
  background: var(--ex-home-list-bgcolor) !important;
}

:deep(.van-tab) {
  color: var(--ex-home-list-ftcolor) !important;
}

:deep(.van-tab--active) {
  color: var(--ex-home-list-ftcolor3) !important;
}
</style>
