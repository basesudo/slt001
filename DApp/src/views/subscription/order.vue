<template>
  <!-- 申购订单 -->
  <div class="columnFlex">
    <HeaderBar :currentName="_t18(`pledge_order_record`)" :border_bottom="true"></HeaderBar>
  </div>
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
      <div class="item" v-for="(item, index) in list" :key="index">
        <!-- 订单号 -->
        <div class="everyItem">
          <div>{{ _t18('order_number') }}</div>
          <div class="itemRight fw-num">
            <Copy :data="item.orderId" :contentFix="'start'" :fontSize="'12px'">
              <template #copyMsg>
                <span style="font-size: 12px">{{ item.orderId }}</span>
              </template>
            </Copy>
          </div>
        </div>
        <!-- 币种 -->
        <div class="everyItem">
          <div>{{ _t18('recharge_coin') }}</div>
          <div class="itemRight fw-num">
            {{ item.ownCoin }}
          </div>
        </div>
        <!-- 数量 -->
        <div class="everyItem">
          <div>{{ _t18('metastaking_bb_count') }}</div>
          <div class="itemRight fw-num">
            {{ item.number }}
          </div>
        </div>
        <!-- 销售价格 -->
        <div class="everyItem">
          <div>{{ _t18('selling_price') }}</div>
          <div class="itemRight fw-num">
            {{ item.price }}
          </div>
        </div>
        <!-- 总价 -->
        <div class="everyItem">
          <div>{{ _t18('total_price') }}</div>
          <div class="itemRight fw-num">
            {{ item.amount }}
          </div>
        </div>
      </div>
    </van-list>
    <Nodata v-if="list.length === 0 && isShow"></Nodata>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import Copy from '@/components/common/Copy/index.vue'
import { _t18, _timeFormat } from '@/utils/public'
import { getOwnCoinOrder } from '@/api/subscription/index'
const list = ref([])
const pageNum = ref(1)
const pageSize = ref(8)
const isShow = ref(false)
const loading = ref(false)
const finished = ref(false)
const total = ref(0)
const onLoad = async () => {
  try {
    const data = await getInit()
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
const getInit = async () => {
  let params = {}
  // params = {
  //   pageNum: pageNum.value,
  //   pageSize: pageSize.value,
  //   orderByColumn: 'createTime',
  //   isAsc: 'desc'
  // }
  params = `pageNum=${pageNum.value}&pageSize=${pageSize.value}&orderByColumn=createTime&isAsc=desc`
  const res = await getOwnCoinOrder(params)
  if (res.code === 200) {
    total.value = res.total
    return res.rows
  } else {
    finished.value = true
  }
}
onMounted(() => {
  onLoad()
})
</script>
<style lang="scss" scoped>
* {
  color: var(--ex-home-list-ftcolor2);
}
.recordList {
  max-height: 100vh;
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
.item {
  padding: 10px 15px 10px;
  border-bottom: 1px solid var(--ex-border-color);
  .everyItem {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--ex-passive-font-color);
    .itemRight {
      font-size: 12px;
      // color: var(--ex-passive-font-color);
    }
  }
}
</style>
