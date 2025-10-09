<template>
  <HeaderBar :currentName="`NFT`" />
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
import Search from '@/views/nft/components/Search/index.vue' // 搜索
import Service from '@/views/nft/components/Service/index.vue' //客服
import FooterList from '@/views/nft/components/NftList/index.vue' // 作品列表
import HistoryItem from '@/views/nft/components/NftList/historyItem.vue' // 交易历史
import { ref, onMounted, provide, watch } from 'vue'
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
const searchName = ref('')
provide('searchName', searchName)
watch(
  () => searchName.value,
  (n) => {
    console.log(n)
  }
)
</script>
<style lang="scss" scoped>
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
  padding: 0 15px;
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
