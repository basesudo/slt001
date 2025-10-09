<template>
  <div class="columnFlex">
    <HeaderBar :currentName="_t18(`host.detail`)" />
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
        <!-- 时间 -->
        <div class="everyItem">
          <div>{{ _t18(`k_time`) }}</div>
          <div class="itemRight fw-num">
            {{ _timeFormat(item.createTimes, 'DD/MM/YYYY HH:mm', true) }}
          </div>
        </div>
        <!-- 收益 -->
        <div class="everyItem">
          <div>{{ _t18(`income`) }}</div>
          <div class="itemRight fw-num">{{ item.amount }} ETH</div>
        </div>
        <!-- 账户余额 -->
        <div class="everyItem">
          <div>{{ _t18(`asset_account`) }}</div>
          <div class="itemRight fw-num">{{ item.totleAmount }} USDT</div>
        </div>
      </div>
    </van-list>
    <Nodata v-if="list.length === 0 && isShow"></Nodata>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { _t18, _timeFormat } from '@/utils/public'
import { showOrderDetail } from '@/api/defi/index'
import { useUserStore } from '@/store/user/index.js'
const userStore = useUserStore()
const list = ref([])
const pageNum = ref(1)
const pageSize = ref(20)
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
  try {
    // const data = {
    //   userId: userStore.userInfo.user?.userId,
    //   pageNum: pageNum.value,
    //   pageSize: pageSize.value,
    //   orderByColumn:'createTime',
    //   isAsc:'desc'
    // }
    const data = `userId=${userStore.userInfo.user?.userId}&pageNum=${pageNum.value}&pageSize=${pageSize.value}&orderByColumn=createTime&isAsc=desc`
    const res = await showOrderDetail(data)
    if (res.code === 200) {
      total.value = res.total
      return res.rows
    } else {
      finished.value = true
    }
  } catch (error) {}
}
onMounted(() => {
  if (userStore.userInfo.user?.userId) {
    onLoad()
  }
})
</script>
<style lang="scss" scoped>
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
    font-size: 12px;
    color: var(--ex-passive-font-color);
    .itemRight {
      font-size: 12px;
      color: var(--ex-default-font-color);
    }
  }
}
</style>
