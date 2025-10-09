<template>
  <!-- 充值记录 -->
  <HeaderBar :currentName="_t18('recharge_order')"></HeaderBar>
  <Tab :tabList="tabList" :active="curIndex" @change="changeIndex">
    <template #tabContent>
      <!-- 下拉刷新 -->
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        :loading-text="_t18('loading')"
        :loosing-text="_t18('release_refresh')"
      >
        <!-- 加载中动画 -->
        <van-loading v-if="showLoading" />
        <!-- 数据列表 -->
        <div v-else>
          <!-- 没有更多数据了 no_more_data 加载中  loading-->
          <van-list
            v-if="tabContentList.length > 0"
            v-model:loading="loading"
            :finished="finished"
            :finished-text="_t18(`no_more_data`)"
            :loading-text="_t18(`loading`)"
            @load="onLoad"
          >
            <van-cell v-for="(item, index) in tabContentList" :key="index">
              <OrderList :data="item"></OrderList>
            </van-cell>
          </van-list>
          <!-- 数据为空 -->
          <Nodata v-else />
        </div>
      </van-pull-refresh>
    </template>
  </Tab>
</template>

<script setup>
import { getRechargeList } from '@/api/account'
import Tab from '@/components/Tab/index.vue'
import OrderList from '../components/orderList.vue'
import { _t18 } from '@/utils/public'
const refreshing = ref(false) //下拉刷新的加载展示
const showLoading = ref(true) //加载动画
const loading = ref(false) //分页加载
const finished = ref(false) //数据是否加载完成
//下拉加载事件（初始化数据）
const onRefresh = () => {
  refreshing.value = false
  showLoading.value = true
  finished.value = false
  pageNum.value = 1
  loading.value = true
  tabContentList.value = []
  getList()
}

const curIndex = ref(0)
const tabList = computed(() => {
  let list = []
  // list = ['全部', '审核', '成功', '失败']
  list = [
    _t18('recharge_tab_all', ['aams']),
    _t18('recharge_tab_wait'),
    _t18('recharge_tab_success'),
    _t18('recharge_tab_error')
  ]
  return list
})
/**
 * 充值记录查询
 * pageNum页码
 * pageSize每页条数
 * total总条数
 */
const pageNum = ref(1)
const pageSize = ref(2)
const total = ref(0)
const tabContentList = ref([]) //数据列表
const getList = () => {
  let params = `pageNum=${pageNum.value}&pageSize=${pageSize.value}`
  // 排除全部时不传参数
  if (curIndex.value != '0') {
    params = `status=${curIndex.value - 1}&pageNum=${pageNum.value}&pageSize=${pageSize.value}`
  }
  getRechargeList(params).then((res) => {
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
      // 数据加载完成
      if (tabContentList.value.length >= total.value) {
        finished.value = true
      }
      pageNum.value++
    } else {
      finished.value = true
      loading.value = false
      showLoading.value = false
      refreshing.value = false
    }
  })
}
const onLoad = () => {
  loading.value = true
  getList()
}
const changeIndex = (v) => {
  curIndex.value = v
  showLoading.value = true
  tabContentList.value = []
  finished.value = false
  pageNum.value = 1
  loading.value = true
  // getList()
}
watch(
  curIndex,
  () => {
    getList()
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.content {
  background: var(--ex-default-background-color) !important;
  border-bottom: 5px solid var(--ex-border-color);
  padding: 20px 15px;
}
.van-loading {
  text-align: center;
  padding: 30px;
}
.van-list {
  min-height: calc(100vh - 60px - 44px);
}
:deep(.van-cell) {
  background: var(--ex-default-background-color) !important;
}
:deep(.van-cell::after) {
  border-bottom: 1px solid var(--ex-border-color) !important;
}
.van-popup {
  padding: 20px 30px;
}
.showErr {
  padding: 20px 30px;
}
:deep(.van-tabs) {
  background: var(--ex-home-tabbar-background-color) !important ;
}
:deep(.van-tabs__nav) {
  background: var(--ex-home-tabbar-background-color) !important ;
}
:deep(.van-tab) {
  color: var(--ex-home-list-ftcolor) !important;
  background: var(--ex-home-tabbar-background-color) !important ;
}
:deep(.van-tab--active) {
  color: var(--ex-home-list-ftcolor3) !important;
}
</style>
