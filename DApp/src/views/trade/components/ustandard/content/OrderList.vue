<template>
  <div class="orderBox">
    <!-- tab切换：当前持仓，当前委托，止盈止损，历史委托 -->
    <van-tabs
      v-model:active="curActive"
      shrink
      color="transparent"
      title-active-color="#17AC74"
      title-inactive-color="#5d626d"
    >
      <van-tab
        v-for="(item, index) in tabList"
        :key="index"
        :title="item.num > 0 ? item.label + '(' + item.num + ')' : item.label"
      >
        <div class="listBox">
          <div>
            <van-list
              :finished="finished"
              :finished-text="_t18(`no_more_data`)"
              :loading-text="_t18(`loading`)"
              @load="onLoad"
              v-model:loading="loading"
            >
              <van-cell v-for="(items, indexs) in dataNewList" :key="indexs" :border="false">
                <OrderItem
                  :recordListItem="items"
                  :currentEntruset="curActive"
                  :availableBalance="availableBalance"
                  @updateList="updateList"
                  @updateUser="updateUser"
                ></OrderItem>
              </van-cell>
            </van-list>
          </div>
          <!-- <Nodata /> -->
        </div>
      </van-tab>
    </van-tabs>
    <!-- 隐藏其他币种，刷新 -->
    <div class="tab_right">
      <svg-load
        :name="showEye ? 'yanjin-k' : 'yanjin-g'"
        class="entrustRImg"
        @click="handelEye"
      ></svg-load>
      <svg-load name="shuaxin" class="entrustRImg" @click="handelRefresh"></svg-load>
    </div>
  </div>
</template>

<script setup>
import OrderItem from './EntrustOrderItem.vue'
import { formatCurrentcurrency } from '@/utils/filters'
import { _t18 } from '@/utils/public'
import { onMounted } from 'vue'
import {
  submitUcontract,
  contractHistoryList,
  contractLossList,
  orderList
} from '@/api/trade/index'
const props = defineProps({
  coinInfo: {
    type: Object,
    default: () => {}
  },
  availableBalance: {
    type: Number
  }
})
const tabList = ref([
  { label: _t18(`current_position`, ['latcoin']), value: 0, num: 0 },
  { label: _t18(`exchange_curentrust`, ['bitmake', 'ebc', 'latcoin']), value: 1, num: 0 },
  { label: _t18(`profit_loss`, ['paxpay', 'latcoin', 'aams']), value: 2, num: 0 },
  {
    label: ['coinsexpto'].includes(__config._APP_ENV)
      ? _t18(`exchange_hisentrust2`)
      : _t18(`exchange_hisentrust`, ['bitmake', 'ebc', 'latcoin']),
    value: 3,
    num: 0
  }
])
/**
 * 订单数据
 */
// 数据列表
const showEye = ref(true)
const loading = ref(false)
const finished = ref(false)
const total0 = ref(0)
const total1 = ref(0)
const total2 = ref(0)
const total3 = ref(0)
const pageSize = ref(5)
const pageNum = ref(1)
const dataList = ref()
const dataNewList = ref([])
const dataTab0 = ref([])
const dataTab1 = ref([])
const dataTab2 = ref([])
const dataTab3 = ref([])
const updateList = (val) => {
  handelRefresh()
  if (val == 1) {
    // 急速平仓
    getTab3()
  } else if (val == 2) {
    // 止盈止损
    getTab2()
  }
}
import { useUserStore } from '@/store/user/index'
const userStore = useUserStore()
/** 更新user */
const updateUser = () => {
  userStore.getUserInfo()
}
// 切换列表
const curActive = ref(0)
// 上拉加载分页
const onLoad = () => {
  loading.value = true
  if (curActive.value == 0) {
    getTab0()
  }
  if (curActive.value == 1) {
    getTab1()
  }
  if (curActive.value == 2) {
    getTab2()
  }
  if (curActive.value == 3) {
    getTab3()
  }
}
// 当前持仓
const getTab0 = async () => {
  loading.value = true
  finished.value = false
  const data = {
    status: 0,
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  const res = await contractHistoryList(data)
  if (res.code == '200') {
    setTimeout(() => {
      loading.value = false
      res.rows && dataTab0.value.push(...res.rows)
      filterEyes()
      total0.value = res.total
      if (dataTab0.value.length >= total0.value) {
        finished.value = true
      } else {
        pageNum.value++
      }
    }, 500)
    tabList.value[0].num = res.total
  }
}
// 当前委托
const getTab1 = async () => {
  loading.value = true
  finished.value = false
  const data = {
    status: 0,
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  const res = await orderList(data)
  if (res.code == '200') {
    setTimeout(() => {
      loading.value = false
      res.rows && dataTab1.value.push(...res.rows)
      filterEyes()
      total1.value = res.total
      if (dataTab1.value.length >= total1.value) {
        finished.value = true
      } else {
        pageNum.value++
      }
    }, 500)
    tabList.value[1].num = res.total
  }
}
// 止盈止损
const getTab2 = async () => {
  loading.value = true
  finished.value = false
  const data = {
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  const res = await contractLossList(data)
  if (res.code == '200') {
    setTimeout(() => {
      loading.value = false
      res.rows && dataTab2.value.push(...res.rows)
      filterEyes()
      total2.value = res.total
      if (dataTab2.value.length >= total2.value) {
        finished.value = true
      } else {
        pageNum.value++
      }
    }, 500)
    tabList.value[2].num = res.total
  }
}
// 历史委托
const getTab3 = async (status) => {
  loading.value = true
  finished.value = false
  const data = {
    status: 1,
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  const res = await contractHistoryList(data)
  if (res.code == '200') {
    setTimeout(() => {
      loading.value = false
      res.rows && dataTab3.value.push(...res.rows)
      filterEyes()
      total3.value = res.total
      if (dataTab3.value.length >= total3.value) {
        finished.value = true
      } else {
        pageNum.value++
      }
    }, 500)
    tabList.value[3].num = res.total
  }
}

const filterDataList = (n) => {
  switch (n) {
    case 0:
      dataList.value = dataTab0.value
      return
    case 1:
      dataList.value = dataTab1.value
      return
    case 2:
      dataList.value = dataTab2.value
      return
    case 3:
      dataList.value = dataTab3.value
      return
    default:
      break
  }
}
const init = () => {
  getTab0()
  getTab1()
  getTab2()
  getTab3()
}
// 刷新按钮
const handelRefresh = () => {
  dataList.value = []
  dataNewList.value = []
  pageNum.value = 1
  if (curActive.value == 0) {
    dataTab0.value = []
    getTab0()
  }
  if (curActive.value == 1) {
    dataTab1.value = []
    getTab1()
  }
  if (curActive.value == 2) {
    dataTab2.value = []
    getTab2()
  }
  if (curActive.value == 3) {
    dataTab3.value = []
    getTab3()
  }
  filterDataList(curActive.value)
}

watch(
  curActive,
  (n) => {
    showEye.value = true
    loading.value = false
    finished.value = false
    handelRefresh()
    filterDataList(n)
  },
  { immediate: true }
)

onMounted(() => {
  if (['rxce'].includes(__config._APP_ENV)) {
    // 当前持仓，当前委托，历史委托
    tabList.value = [
      { label: _t18(`current_position`), value: 0, num: 0 },
      { label: _t18(`exchange_curentrust`), value: 1, num: 0 },
      {},
      {
        label: _t18(`exchange_hisentrust`),
        value: 3,
        num: 0
      }
    ]
  }
  getTab1()
  getTab2()
  getTab3()
})
// 撤单
const reduceOrderNum = () => {
  getTab2()
}
/**
 * 点击小眼睛
 */
const handelEye = () => {
  showEye.value = !showEye.value
  filterEyes()
}
// 过滤当前币种订单
const filterEyes = () => {
  if (showEye.value) {
    dataNewList.value = dataList.value
  } else {
    dataNewList.value = formatCurrentcurrency(dataList.value, props.coinInfo.coin)
  }
}
defineExpose({
  init,
  handelRefresh
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
