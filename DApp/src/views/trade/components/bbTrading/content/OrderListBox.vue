<template>
  <div class="orderBox">
    <!-- tab切换 -->
    <van-tabs
      shrink
      color="transparent"
      title-active-color="#17AC74"
      title-inactive-color="#5d626d"
      @click-tab="clickTab"
    >
      <van-tab
        v-for="(item, index) in tabList"
        :key="index"
        :title="item.num > 0 ? item.label + '(' + item.num + ')' : item.label"
      >
        <div class="listBox">
          <div v-if="dataNewList?.length > 0">
            <van-list
              :finished="finished"
              :finished-text="_t18(`no_more_data`)"
              :loading-text="_t18(`loading`)"
              @load="onLoad"
              v-model:loading="loading"
            >
              <van-cell v-for="(item, index) in dataNewList" :key="index" :border="false">
                <EntrustOrderItem :data="item" @reduceOrderNum="reduceOrderNum"></EntrustOrderItem>
              </van-cell>
            </van-list>
          </div>
          <Nodata v-if="loading == false && dataNewList?.length <= 0"></Nodata>
        </div>
      </van-tab>
    </van-tabs>
    <div class="tab_right">
      <svg-load
        :name="showEye ? 'yanjin-k' : 'yanjin-g'"
        class="entrustRImg"
        @click="handelEye"
      ></svg-load>
      <svg-load name="shuaxin" class="entrustRImg" @click="refresh"></svg-load>
    </div>
  </div>
</template>

<script setup>
import { formatCurrentcurrency } from '@/utils/filters'
import { _t18 } from '@/utils/public'
import { onMounted } from 'vue'
import EntrustOrderItem from './EntrustOrderItem.vue'
import { getOrderListCurrencyApi } from '@/api/trade/index'
import { useUserStore } from '@/store/user/index'
const userStore = useUserStore()
const props = defineProps({
  coinInfo: {
    type: Object,
    default: () => {}
  }
})
const tabList = ref([
  { label: _t18(`exchange_curentrust`, ['bitmake', 'ebc']), value: 0, num: 0 },
  { label: _t18(`exchange_hisentrust`, ['bitmake', 'ebc','rxce']), value: 1, num: 0 }
])
/**
 * 订单数据
 */
// 数据列表
const showEye = ref(true)
const loading = ref(false)
const finished = ref(false)
const total = ref(0)
const pageSize = ref(10)
const pageNum = ref(1)
const dataList = ref([])
const dataNewList = ref([])
// 上拉加载分页
const onLoad = () => {
  loading.value = true
  getOrderList(orderType.value)
}
const getOrderList = async (status) => {
  loading.value = true
  finished.value = false
  let params = `isAsc=desc&orderByColumn=updateTime&status=${status}&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getOrderListCurrencyApi(params)
  if (res.code == '200') {
    setTimeout(() => {
      loading.value = false
      res.rows && dataList.value.push(...res.rows)
      filterEyes(props.coinInfo.coin)
      total.value = res.total
      if (dataList.value.length >= total.value) {
        finished.value = true
      }
      pageNum.value++
    }, 500)
    if (status == 0) {
      tabList.value[0].num = res.total
    } else if (status == 1) {
      tabList.value[1].num = res.total
    }
  }
}
const getNum = async (status) => {
  let params = `isAsc=desc&orderByColumn=updateTime&status=${status}&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getOrderListCurrencyApi(params)
  if (res.code == '200') {
    if (status == 0) {
      tabList.value[0].num = res.total
    } else if (status == 1) {
      tabList.value[1].num = res.total
    }
  }
}
// 切换列表
const orderType = ref(0)
const clickTab = (e) => {
  dataList.value = []
  dataNewList.value = []
  pageNum.value = 1
  orderType.value = e.name
  getOrderList(orderType.value)
}
const init = () => {
  getOrderList(0)
  getNum(1)
}
onMounted(() => {
  init()
})
//刷新订单
const refresh = () => {
  dataList.value = []
  dataNewList.value = []
  pageNum.value = 1
  if (orderType.value == 0) {
    getOrderList(0)
    getNum(1)
  }
  if (orderType.value == 1) {
    getOrderList(1)
    getNum(0)
  }
}
// 撤单
const reduceOrderNum = () => {
  refresh()
  userStore.getUserInfo()
}
/**
 * 点击小眼睛
 */
const handelEye = () => {
  showEye.value = !showEye.value
  filterEyes(props.coinInfo.coin)
}
// 过滤当前币种订单
const filterEyes = (coin) => {
  if (showEye.value) {
    dataNewList.value = dataList.value
  } else {
    dataNewList.value = formatCurrentcurrency(dataList.value, coin)
  }
}
defineExpose({
  refresh
})
</script>

<style lang="scss" scoped>
.orderBox {
  position: relative;
}
:deep(.van-tabs__wrap){
  border-bottom: 1px solid var(--ex-border-color);
}
:deep(.van-tabs__nav) {
  padding-right: 80px;
  background: var(--bgColor) !important;
}
.tab_right {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--bgColor) !important;;
  padding: 15px 5px;
  .entrustRImg {
    padding: 0 8px;
    font-size: 12px;
  }
}
.listBox {
  padding: 0;
}
.van-cell{
  background: var(--bgColor) !important;
  padding: 0;
  border-bottom: 1px solid var(--ex-border-color);
}
</style>
