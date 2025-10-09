<template>
  <HeaderBar
    :currentName="_t18('pledge_order_record')"
    :cuttentRight="cuttentRight"
    :border_bottom="true"
  ></HeaderBar>
  <Tab :tabList="tabList" :active="curIndex" @change="changeIndex">
    <template #tabContent>
      <!-- 下拉刷新 -->
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        :loading-text="_t18(`loading`)"
        :loosing-text="_t18(`release_refresh`)"
      >
        <!-- 加载中动画 -->
        <van-loading v-if="showLoading" />
        <!-- 数据列表 -->
        <div v-else>
          <van-list
            v-if="tabContentList.length > 0"
            v-model:loading="loading"
            :finished="finished"
            :finished-text="_t18(`no_more_data`)"
            :loading-text="_t18(`loading`)"
            @load="onLoad"
          >
            <van-cell v-for="(item, index) in tabContentList" :key="index">
              <OrderCard :data="item" @getList="getList"></OrderCard>
            </van-cell>
          </van-list>
          <!-- 数据为空 -->
          <Nodata v-else />
        </div>
      </van-pull-refresh> </template
  ></Tab>
</template>
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import { getPledgeOrderList } from '@/api/pledge/index'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { _t18 } from '@/utils/public'
import Tab from '@/components/Tab/index.vue'
import OrderCard from './components/orderCard.vue'
import { showToast } from 'vant'
const refreshing = ref(false) //下拉刷新的加载展示
const showLoading = ref(true) //加载动画
const loading = ref(false) //分页加载
const finished = ref(false) //数据是否加载完成
const status = ref()
const getList = () => {
  tabContentList.value = []
  pageNum.value = 1
  getOrderList(status.value)
}
//下拉加载事件（初始化数据）
const onRefresh = () => {
  refreshing.value = false
  showLoading.value = true
  finished.value = false
  pageNum.value = 1
  loading.value = true
  tabContentList.value = []
  getOrderList(status.value)
}
const route = useRoute()
const curIndex = ref(0)
const cuttentRight = reactive({
  iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }]
})
const tabList = computed(() => {
  let list = []
  list = [
    _t18('all', ['aams']),
    _t18('pledge_in_progress'),
    _t18('pledge_completed'),
    _t18('pledge_redeem_ok')
  ]
  return list
})
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tabContentList = ref([])
const getOrderList = async (status) => {
  let params = `pageNum=${pageNum.value}&pageSize=${pageSize.value}`
  // 排除全部时不传参数
  if (curIndex.value != '0') {
    // curIndex.value - 1
    params = `status=${status}&pageNum=${pageNum.value}&pageSize=${pageSize.value}`
  }
  const res = await getPledgeOrderList(params)
  if (res.code == '200') {
    setTimeout(() => {
      // 页面加载动画，下拉刷新动画
      if (showLoading.value) {
        showLoading.value = false
      }
      if (refreshing.value) {
        refreshing.value = false
      }
    }, 200)
    //分页加载动画
    loading.value = false
    tabContentList.value = tabContentList.value.concat(res.rows)
    total.value = res.total
    if (tabContentList.value.length >= total.value) {
      finished.value = true
    }
    pageNum.value++
  } else {
    finished.value = true
    loading.value = false
    showLoading.value = false
    refreshing.value = false
    showToast(res.msg)
  }
}
const onLoad = () => {
  loading.value = true
  getOrderList(status.value)
}
const changeIndex = (v) => {
  curIndex.value = v
  showLoading.value = true
  tabContentList.value = []
  finished.value = false
  pageNum.value = 1
  loading.value = true
}
watch(
  curIndex,
  (newValue) => {
    status.value = newValue - 1
    getOrderList(status.value)
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.content {
  border-bottom: 1px solid var(--ex-border-color);
  padding: 20px 15px;
}
.van-loading {
  text-align: center;
  padding: 30px;
}
:deep(.van-cell) {
  background: var(--ex-default-background-color) !important;
}
:deep(.van-tabs) {
  background: var(--ex-home-tabbar-background-color) !important ;
}
:deep(.van-tab) {
  color: var(--ex-home-list-ftcolor) !important;
  background: var(--ex-home-tabbar-background-color) !important ;
}
:deep(.van-cell::after) {
  border-bottom: 1px solid var(--ex-border-color) !important;
}
</style>
