<template>
  <div>
    <!-- 申购 -->
    <HeaderBar
      :currentName="_t18(`IEO_subscription`, 'latcoin')"
      :cuttentRight="cuttentRight"
      :border_bottom="true"
    ></HeaderBar>
    <div class="content">
      <van-tabs v-model:active="active" type="card" color="#17ac74" @click-tab="clickTab" background="var(--ex-home-list-bgcolor)">
        <van-tab :title="item.title" v-for="(item, index) in tabList" :key="index">
          <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <div class="tabContent" v-if="dataList.length">
              <Card :data="item" v-for="item in dataList" :key="item.id"></Card>
            </div>
            <Nodata v-else></Nodata>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import Card from './components/Card.vue'
import { ownCoinList } from '@/api/subscription/index'
// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
  loading.value = true
  init()
  setTimeout(() => {
    loading.value = false
  }, 500)
}
const status = ref(1)
const init = async () => {
  let res = await ownCoinList(status.value)
  if (res.code == '200') {
    dataList.value = res.data
  }
}
const cuttentRight = {
  iconRight: [{ iconName: 'jilu', clickTo: '/subscription/order' }]
}
const tabList = [
  { id: 1, title: _t18('Preparation') },
  { id: 2, title: _t18('In_progress') },
  { id: 3, title: _t18('In_over') }
]
const dataList = ref([])
const clickTab = (e) => {
  status.value = e.name + 1
}
watch(
  status,
  (val) => {
    init()
  },
  {
    immediate: true
  }
)
onMounted(() => {
  // init()
})
</script>

<style lang="scss" scoped>
.content {
  padding: 15px 0;
}
.tabContent,
.van-pull-refresh {
  height: calc(100vh - 70px - 30px);
  overflow: auto;
}
:deep(.van-tabs--card > .van-tabs__wrap) {
  height: 35px;
}
:deep(.van-tabs__nav--card) {
  height: 35px;
}
</style>
