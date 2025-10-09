<!-- 我的投资 -->
<template>
  <div class="columnFlex">
    <HeaderBar :currentName="_t18(`my_invest`)" />
    <div class="invest">
      <!-- 总投入价值 -->
      <div class="item">
        <div>{{ _t18(`sum_bet_value`) }}</div>
        <div class="itemRight fw-num">{{ headerObj.sumAmount }} USDT</div>
      </div>
      <!-- 当日赚取奖励 -->
      <div class="item">
        <div>{{ _t18(`earn_rewards`) }}</div>
        <div class="itemRight fw-num">{{ headerObj.commission }} USDT</div>
      </div>
      <!-- 累计收益 -->
      <div class="item">
        <div>{{ _t18(`Cumulative_income`) }}</div>
        <div class="itemRight blueColor fw-num">{{ headerObj.sumEarn }} USDT</div>
      </div>
      <!-- 持仓数量 -->
      <div class="item">
        <div>{{ _t18(`number_of_positions`) }}</div>
        <div class="itemRight fw-num">{{ headerObj.position }}</div>
      </div>
    </div>
    <!-- 交易记录 -->
    <div class="record">{{ _t18(`transaction_record`) }}</div>
    <div class="recordList">
      <!-- 没有更多数据了 no_more_data 加载中  loading-->
      <van-list
        v-if="list.length > 0 && !isShow"
        v-model:loading="loading"
        :finished="finished"
        :finished-text="_t18(`no_more_data`)"
        :loading-text="_t18(`loading`)"
        @load="onLoad"
      >
        <RecordItem v-for="item in list" :key="item" :itemObj="item"></RecordItem>
      </van-list>
      <Nodata v-if="list.length === 0 && isShow"></Nodata>
    </div>
  </div>
</template>
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import RecordItem from './components/recordItem.vue'
import { ref, onMounted } from 'vue'
import { investmentList, personalIncome } from '@/api/financial/index'
import { _t18 } from '@/utils/public'
import { _toFixed } from '@/utils/decimal'
const headerObj = ref({})
const list = ref([])
const pageNum = ref(1)
const pageSize = ref(5)
const isShow = ref(false)
const loading = ref(false)
const finished = ref(false)
const total = ref(0)
const onLoad = async () => {
  try {
    const data = await getInvestment()
    list.value = [...list.value, ...data]
    list.value.length === 0 ? (isShow.value = true) : (isShow.value = false)
    if (list.value.length === total.value) {
      finished.value = true
    }
    pageNum.value++
  } catch (error) {
  } finally {
    loading.value = false
  }
}
const allList = async () => {
  try {
    const res = await personalIncome()
    if (res.code === 200) {
      headerObj.value = res.data
    }
  } catch (error) {}
}
const getInvestment = async () => {
  try {
    const res = await investmentList(pageNum.value, pageSize.value)
    if (res.code === 200) {
      total.value = res.total
      return res.rows
    } else {
      finished.value = true
    }
  } catch (error) {}
}
onMounted(() => {
  allList()
  onLoad()
})
</script>
<style lang="scss" scoped>
.columnFlex {
  height: 100vh;
}
.invest {
  padding: 10px 15px;
  .item {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--ex-passive-font-color);
    .itemRight {
      font-size: 12px;
      color: var(--ex-default-font-color);
    }
    .blueColor {
      color: var(--ex-font-color9);
    }
  }
}
.record {
  font-size: 16px;
  color: var(--ex-default-font-color);
  padding: 20px 15px 0;
  border-top: 1px solid var(--ex-border-color);
}
.recordList {
  flex: 1;
  overflow: auto;
}
:deep(.van-list__finished-text) {
  height: 79px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--ex-passive-font-color);
}
</style>
