<template>
  <HeaderBar :currentName="`NFT`">
    <template #footer>
      <div class="barRight">
        <div class="list">
          <div class="item" :class="!hightStatus ? 'hightStatus' : ''" @click="selectHightStatus(0)">
            ETH
          </div>
          <div class="item" :class="hightStatus ? 'hightStatus' : ''" @click="selectHightStatus(1)">
            USD
          </div>
        </div>
      </div>
    </template>
  </HeaderBar>
  <header>
    <van-tabs swipe-threshold="1">
      <van-tab v-for="(item, index) in allList" :key="index">
        <template #title>
          <div class="tabItem">
            <div class="ff-num">地板价 <span class="tabItemNum fw-bold">+0.00%</span></div>
            <div class="tabItemBot fw-bold">24 USD</div>
          </div>
        </template>
      </van-tab>
    </van-tabs>
  </header>
  <div class="headerChoose">
    <van-tabs v-model:active="currentIndex" line-width="20" line-height="2" color="#3CBC8C" background="#fff"
      title-active-color="#000000" title-inactive-color="#838B9C" @click-tab="switchBtn(currentIndex)">
      <van-tab v-for="(item, index) in headerList" :key="index">
        <template #title>
          <div>{{ item.name }}</div>
        </template>
      </van-tab>
    </van-tabs>
  </div>
  <div class="search">
    <Search :disabledInput="false"></Search>
  </div>
  <footer v-if="!currentIndex">
    <FooterList @click="$router.push('/nftDetail')">
      <template #footerBottom>
        <div class="bottomItem">
          <div class="left ff-num">价格</div>
          <div class="right ff-num">22.00USDT</div>
        </div>
      </template>
    </FooterList>
  </footer>
  <div class="transactionHistory" v-if="currentIndex">
    <HistoryItem @click="$router.push('/nftDetail')"></HistoryItem>
  </div>
  <!-- <Nodata></Nodata> -->
  <Service></Service>
</template>
<script setup>
import { _t18 } from '@/utils/public'
import Search from '@/views/nft/components/Search/index.vue' // 搜索
import Service from '@/views/nft/components/Service/index.vue' //客服
import FooterList from '@/views/nft/components/NftList/index.vue' // 作品列表
import HistoryItem from '@/views/nft/components/NftList/historyItem.vue' // 交易历史
import { ref, onMounted } from 'vue'
const allList = ref([
  {
    name: _t18(`current_position`),
    num: 0
  },
  {
    name: _t18(`exchange_curentrust`, ['bitmake', 'ebc']),
    num: 0
  },
  {
    name: _t18(`profit_loss`),
    num: 0
  },
  {
    name: _t18(`exchange_hisentrust`, ['bitmake', 'ebc']),
    num: 0
  },
  {
    name: _t18(`exchange_hisentrust`, ['bitmake', 'ebc']),
    num: 0
  }
])
const currentIndex = ref(0)
const headerList = computed(() => {
  return [
    {
      name: '作品'
    },
    {
      name: '交易历史'
    }
  ]
})
// 作品/交易历史切换
const switchBtn = (index) => {
  currentIndex.value = index
}
const hightStatus = ref(0)
const selectHightStatus = (v) => {
  hightStatus.value = v
}

onMounted(() => {
  setTimeout(() => {
    const tabs = document.querySelectorAll('.van-tab')
    tabs[tabs.length - 3].style.marginRight = '0'
  }, 0)
})
</script>
<style lang="scss" scoped>
.barRight {
  flex: 1;
  display: flex;
  justify-content: flex-end;

  .list {
    width: 96px;
    height: 34px;
    background: var(--ex-default-background-color);
    border-radius: 3px 3px 3px 3px;
    opacity: 1;
    border: 1px solid var(--ex-border-color);
    display: flex;

    .item {
      font-weight: bold;
      font-size: 14px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hightStatus {
      background: var(--ex-div-bgColor8);
      color: var(--ex-font-color9);
    }
  }
}

.van-tab:last-child {
  margin-right: 0;
}

header {
  padding: 20px 15px;
  border-bottom: 1px solid var(--ex-border-color);

  :deep(.van-tab) {
    flex: none;
    margin-right: 20px;
    padding: 0;
  }

  :deep(.van-tabs__nav) {
    padding: 0;
  }

  :deep(.van-tabs__line) {
    display: none;
  }

  :deep(.van-tabs__wrap) {
    height: auto;
  }

  :deep(.van-tab--active) {
    font-weight: normal;
  }

  .tabItem {
    font-size: 12px;
    color: var(--ex-passive-font-color);

    .tabItemNum {
      color: var(--ex-font-color9);
    }

    .tabItemBot {
      font-size: 12px;
      color: var(--ex-font-color6)
    }
  }
}

.headerChoose {
  display: flex;
  padding: 10px 15px 0;
  font-weight: 700;
  background: var(--ex-home-list-bgcolor);

  :deep(.van-tab) {
    flex: none;
    font-size: 16px;
    margin-right: 30px;
    padding: 0;
    background: var(--ex-home-list-bgcolor);
  }
}

.search {
  padding: 20px 15px;
}

footer {
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;

  .bottomItem {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;

    .left {
      color: var(--ex-passive-font-color);
    }

    .right {
      font-weight: bold;
      color: var(--ex-font-color6)
    }
  }
}

.transactionHistory {
  padding: 0 15px;
}
</style>
