<template>
  <!-- 帮助中心 -->
  help_center
  <HeaderBar :currentName="_t18(`help_center`)" />
  <div v-if="list.length > 0">
    <div class="itemList" v-for="(item, index) in list" :key="index">
      <div class="title">
        <div class="title_top"></div>
        <div>{{ item.title }}</div>
      </div>
      <div v-if="item.infoList.length > 0">
        <div
          class="item"
          v-for="(items, indexs) in item.infoList"
          :key="indexs"
          @click="$router.push(`/helpDetail/${items.id}`)"
        >
          {{ items.question }}
        </div>
      </div>
    </div>
  </div>
  <Nodata v-if="list.length === 0 && isShow"></Nodata>
</template>
<script setup>
import { _t18 } from '@/utils/public'
import { getHelpcenter } from '@/api/help/index'
import { onMounted, ref } from 'vue'
const list = ref([])
const isShow = ref(false)
onMounted(async () => {
  try {
    const res = await getHelpcenter()
    if (res.code === 200) {
      list.value = res.data
      list.value.length === 0 ? (isShow.value = true) : (isShow.value = false)
    }
  } catch (error) {}
})
</script>
<style lang="scss" scoped>
.itemList {
  padding: 20px 15px;
  .title {
    display: flex;
    font-size: 16px;
    color: var(--ex-font-color6);
    font-weight: 600;
    .title_top {
      width: 3px;
      height: 12px;
      margin-right: 10px;
      background: var(--ex-font-color6);
    }
  }
  .item {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 400;
    color: var(--ex-font-color6);
    text-decoration: underline;
  }
}
</style>
