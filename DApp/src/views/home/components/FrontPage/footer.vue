<template>
  <div class="footer">
    <!-- 热门币种 -->
    <!-- <h1 class="title" @click="handelShowTab(0)">{{ _t18('coinbase_h_l_hot') }}</h1> -->
    <!-- <div class="tab_title">
      <h1 :class="showTab===0?'active title':'title'" @click="handelShowTab(0)">{{ _t18('coinbase_h_l_hot') }}<i></i></h1>
      <h1 :class="showTab===1?'active title':'title'" @click="handelShowTab(1)">外汇币种<i></i></h1>
    </div> -->
    <div class="headerChoose">
      <van-tabs
        v-model:active="showTab"
        line-width="20"
        line-height="2"
        title-active-color="#17AC74"
        color="#17ac74"
        title-inactive-color="#5d626d"
        @click-tab="handelShowTab(showTab)"
        shrink
      >
        <van-tab v-for="(item, index) in headerList" :key="index">
          <template #title>
            <div v-if="item.show">{{ item.name }}</div>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <div class="main">
      <!-- 名称 最新价 涨跌幅 -->
      <div class="header-list">
        <div class="item" @click="toDealSort">
          <div>{{ _t18(`home_currencyName`, ['latcoin']) }}</div>
          <div class="arrows" v-if="['latcoin'].includes(_getConfig('_APP_ENV'))">
            <svg-load v-if="arrowList.firstIcon === 0" name="moren" class="itemImg"></svg-load>
            <svg-load v-if="arrowList.firstIcon === 1" name="gao" class="itemImg"></svg-load>
            <svg-load v-if="arrowList.firstIcon === 2" name="di" class="itemImg"></svg-load>
          </div>
        </div>
        <div class="item" @click="toUpSort">
          <div>{{ _t18(`home_newPrice`, ['latcoin']) }}</div>
          <div class="arrows" v-if="['latcoin'].includes(_getConfig('_APP_ENV'))">
            <svg-load v-if="arrowList.secondIcon === 0" name="moren" class="itemImg"></svg-load>
            <svg-load v-if="arrowList.secondIcon === 1" name="gao" class="itemImg"></svg-load>
            <svg-load v-if="arrowList.secondIcon === 2" name="di" class="itemImg"></svg-load>
          </div>
        </div>
        <div class="item" @click="toRafSort">
          <div>{{ _t18(`home_upDown`, ['latcoin', 'aams']) }}</div>
          <div class="arrows" v-if="['latcoin'].includes(_getConfig('_APP_ENV'))">
            <svg-load v-if="arrowList.thirdIcon === 0" name="moren" class="itemImg"></svg-load>
            <svg-load v-if="arrowList.thirdIcon === 1" name="gao" class="itemImg"></svg-load>
            <svg-load v-if="arrowList.thirdIcon === 2" name="di" class="itemImg"></svg-load>
          </div>
        </div>
      </div>

      <!-- <div v-if="tradeStore.secondContractCoinList.length">
          <CurrencyItem
            v-for="(item, index) in tradeStore.secondContractCoinList"
            :key="index"
            :currencyItem="item"
            @click="linkTo(item)"
          ></CurrencyItem>
      </div>
      <Nodata v-else></Nodata> -->

      <div v-if="showTab === 0 && headerList[0].show">
        <div v-if="currentCoinList0.length">
          <CurrencyItem
            v-for="(item, index) in currentCoinList0"
            :key="index"
            :currencyItem="item"
            @click="linkTo(item)"
          ></CurrencyItem>
        </div>
        <Nodata v-else></Nodata>
      </div>
      <div v-if="showTab === 1 && headerList[1].show">
        <div v-if="currentCoinList1.length">
          <CurrencyItem
            v-for="(item, index) in currentCoinList1"
            :key="index"
            :currencyItem="item"
            @click="linkTo(item)"
          ></CurrencyItem>
        </div>
        <Nodata v-else></Nodata>
      </div>
      <div v-if="showTab === 2 && headerList[2].show">
        <div v-if="currentCoinList2">
          <CurrencyItem
            v-for="(item, index) in currentCoinList2"
            :key="index"
            :currencyItem="item"
            @click="linkTo(item)"
          ></CurrencyItem>
        </div>
        <Nodata v-else></Nodata>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  letterSmallToLarge,
  letterLargeToSmall,
  LatestpriceLargeToSmall,
  LatestpriceSmallToLarge,
  filterKeyWord
} from '@/utils/filters'
import CurrencyItem from '@/components/CurrencyList/currencyItem.vue'
import { useTradeStore } from '@/store/trade/index'
import { useMainStore } from '@/store/index.js'
import { useRouter } from 'vue-router'
import { _t18 } from '@/utils/public'
const tradeStore = useTradeStore()
const mainStroe = useMainStore()
const $router = useRouter()
const linkTo = (item) => {
  if (!['latcoin'].includes(__config._APP_ENV)) {
    mainStroe.setTradeStatus(Number(0))
    $router.push(`/trade?symbol=${item.coin}`)
  } else {
    mainStroe.setTradeStatus(Number(0))
    $router.push(`/tradeU?symbol=${item.coin}`)
  }
}
const headerList = computed(() => {
  return [
    {
      name: _t18(`coinbase_h_l_hot`, ['latcoin']),
      show: true
    },
    {
      name: _t18(`coinbase_h_l_out`, ['latcoin']),
      show: true
    },
    {
      name: _t18(`coinbase_h_l_gold`),
      show: ['latcoin'].includes(__config._APP_ENV) ? false : true
    }
  ]
})
const currentCoinList0 = ref(
  tradeStore.secondContractCoinList.filter((it, inx) => {
    return it.coinType == 2
  })
)
const currentCoinList1 = ref(
  tradeStore.secondContractCoinList.filter((it, inx) => {
    return it.coinType == 1
  })
)
const currentCoinList2 = ref(
  tradeStore.secondContractCoinList.filter((it, inx) => {
    return it.coinType == 3
  })
)
// 筛选
let arrowList = ref({
  firstIcon: 0,
  secondIcon: 0,
  thirdIcon: 0
})
// 切换名称
const toDealSort = () => {
  arrowList.value.secondIcon = 0
  arrowList.value.thirdIcon = 0
  console.log(arrowList.value)
  if (arrowList.value.firstIcon == 0) {
    arrowList.value.firstIcon = 1
    currentCoinList0.value = letterSmallToLarge(currentCoinList0.value, 'coin')
    currentCoinList1.value = letterSmallToLarge(currentCoinList1.value, 'coin')
    currentCoinList2.value = letterSmallToLarge(currentCoinList2.value, 'coin')
  } else if (arrowList.value.firstIcon == 1) {
    arrowList.value.firstIcon = 2
    currentCoinList0.value = letterLargeToSmall(currentCoinList0.value, 'coin')
    currentCoinList1.value = letterLargeToSmall(currentCoinList1.value, 'coin')
    currentCoinList2.value = letterLargeToSmall(currentCoinList2.value, 'coin')
  } else if (arrowList.value.firstIcon == 2) {
    arrowList.value.firstIcon = 0
    currentCoinList0.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 2
    })
    currentCoinList1.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 1
    })
    currentCoinList2.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 3
    })
  }
}
// 切换最新价
const toUpSort = () => {
  arrowList.value.firstIcon = 0
  arrowList.value.thirdIcon = 0
  console.log(arrowList.value)
  if (arrowList.value.secondIcon == 0) {
    arrowList.value.secondIcon = 1
    currentCoinList0.value = LatestpriceLargeToSmall(
      currentCoinList0.value,
      tradeStore.allCoinPriceInfo,
      'close'
    )
    currentCoinList1.value = LatestpriceLargeToSmall(
      currentCoinList1.value,
      tradeStore.allCoinPriceInfo,
      'close'
    )
    currentCoinList2.value = LatestpriceLargeToSmall(
      currentCoinList2.value,
      tradeStore.allCoinPriceInfo,
      'close'
    )
  } else if (arrowList.value.secondIcon == 1) {
    arrowList.value.secondIcon = 2
    currentCoinList0.value = LatestpriceSmallToLarge(
      currentCoinList0.value,
      tradeStore.allCoinPriceInfo,
      'close'
    )
    currentCoinList1.value = LatestpriceSmallToLarge(
      currentCoinList1.value,
      tradeStore.allCoinPriceInfo,
      'close'
    )
    currentCoinList2.value = LatestpriceSmallToLarge(
      currentCoinList2.value,
      tradeStore.allCoinPriceInfo,
      'close'
    )
  } else if (arrowList.value.secondIcon == 2) {
    arrowList.value.secondIcon = 0
    currentCoinList0.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 2
    })
    currentCoinList1.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 1
    })
    currentCoinList2.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 3
    })
  }
}
// 切换涨跌
const toRafSort = () => {
  arrowList.value.firstIcon = 0
  arrowList.value.secondIcon = 0
  if (arrowList.value.thirdIcon === 0) {
    arrowList.value.thirdIcon = 1
    currentCoinList0.value = LatestpriceLargeToSmall(
      currentCoinList0.value,
      tradeStore.allCoinPriceInfo,
      'change',
      1
    )
    currentCoinList1.value = LatestpriceLargeToSmall(
      currentCoinList1.value,
      tradeStore.allCoinPriceInfo,
      'change',
      1
    )
    currentCoinList2.value = LatestpriceLargeToSmall(
      currentCoinList2.value,
      tradeStore.allCoinPriceInfo,
      'change',
      1
    )
  } else if (arrowList.value.thirdIcon === 1) {
    arrowList.value.thirdIcon = 2
    currentCoinList0.value = LatestpriceSmallToLarge(
      currentCoinList0.value,
      tradeStore.allCoinPriceInfo,
      'change',
      1
    )
    currentCoinList1.value = LatestpriceSmallToLarge(
      currentCoinList1.value,
      tradeStore.allCoinPriceInfo,
      'change',
      1
    )
    currentCoinList2.value = LatestpriceSmallToLarge(
      currentCoinList2.value,
      tradeStore.allCoinPriceInfo,
      'change',
      1
    )
  } else if (arrowList.value.thirdIcon === 2) {
    arrowList.value.thirdIcon = 0
    currentCoinList0.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 2
    })
    currentCoinList1.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 1
    })
    currentCoinList2.value = tradeStore.secondContractCoinList.filter((it, inx) => {
      return it.coinType == 3
    })
  }
}
const showTab = ref(['ebc'].includes(__config._APP_ENV) ? 1 : 0)
const handelShowTab = (item) => {
  showTab.value = item
}
</script>
<style lang="scss" scoped>
.footer {
  padding-bottom: 120px;
  // .tab_title {
  //   display: flex;
  //   background-color: #fbfbfb;
  // }
  // .title {
  //   padding: 20px 15px 20px;
  //   font-size: 16px;
  //   color: #838b9c;

  //   font-weight: bold;
  // }
  h1.active {
    color: var(--ex-default-font-color);
    position: relative;

    i {
      background-color: var(--ex-active-font-color);
      position: absolute;
      width: 20px;
      height: 2px;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      transition: all 0.2s;
    }

    // font-size: 18px;
  }

  .main {
    background-color: var(--ex-default-background-color);
    // padding-top: 10px;
  }

  .header-list {
    padding: 15px 15px 5px;
    font-size: 12px;
    color: var(--ex-home-list-ftcolor2);
    display: flex;
    justify-content: space-between;

    .item {
      display: flex;
      align-items: center;
      .arrows {
        display: flex;
        flex-direction: column;
        margin-left: 5px;
        .itemImg {
          width: 6px;
          height: 8px;
        }
      }
    }
    .item:nth-child(2) {
      flex: 1;
      text-align: right;
      justify-content: right;
    }

    .item:nth-child(3) {
      margin-left: 20px;
      max-width: 80px;
      min-width: 80px;
      text-align: right;
      justify-content: flex-end;
    }
  }
}

.headerChoose {
  display: flex;
  padding: 5px 10px;
  background: var(--ex-home-list-bgcolor);

  :deep(.van-tab) {
    flex: none;
    font-size: 16px;
    margin-right: 20px;
    padding: 0;
    color: var(--ex-home-list-ftcolor) !important;
  }
  :deep(.van-tabs__nav) {
    background: var(--ex-home-list-bgcolor) !important ;
  }

  // :deep(.van-tab__text) {
  //   font-size: 16px;
  //   color: var(--ex-home-list-ftcolor);
  //   // color: var(--ex-home-list-ftcolor);
  // }

  :deep(.van-tab--active) {
    font-weight: normal;
    color: var(--ex-home-list-ftcolor3) !important;
  }
}
</style>
