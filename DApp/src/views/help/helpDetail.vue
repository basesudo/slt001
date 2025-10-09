<template>
  <div>
    <HeaderBar :currentName="_t18(`help_center`)" />
    <div class="content">
      <div class="title">{{ questionDetail.question }}</div>
      <div class="time">{{ questionDetail.createTime }}</div>

      <div class="itemDetailObj" v-html="currentHtml"></div>
      <Nodata v-if="!currentHtml"></Nodata>
    </div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
import { getHelpcenterDetail } from '@/api/help/index'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const Route = useRoute()
const currentHtml = ref('')
const questionDetail = ref({})
onMounted(async () => {
  if (Route.params.id) {
    try {
      const res = await getHelpcenterDetail(Route.params.id)
      if (res.code === 200) {
        questionDetail.value = res.data
        currentHtml.value = res.data.content
      }
    } catch (error) {}
  }
})
</script>
<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  color: var(--ex-font-color6);
  padding: 15px;
}
.time {
  padding: 0 15px;
  font-size: 14px;
  color: var(--ex-font-color8);
}
:deep(.content) {
  .itemDetailObj {
    font-size: 14px;
    padding: 15px;
    color: var(--ex-default-font-color);
    line-height: 1.4;
  }
  strong {
    font-weight: bold;
  }
  img {
    margin: 15px 0;
    width: 100%;
    object-fit: contain;
  }
}
</style>
