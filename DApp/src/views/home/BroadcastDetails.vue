<template>
  <HeaderBar :currentName="currentName" />
  <div class="itemDetailObj" v-html="currentHtml"></div>
</template>
<script setup>
import { onMounted } from 'vue'
import { noticeDetail } from '@/api/common/index'
import { useRoute } from 'vue-router'
const $route = useRoute()
const currentName = ref('')
const currentHtml = ref(null)
onMounted(async () => {
  try {
    const res = await noticeDetail($route.query.id)
    if (res.code === 200) {
      currentName.value = res.data.noticeTitle
      currentHtml.value = res.data.noticeContent
    }
  } catch (error) {}
})
</script>
<style lang="scss">
.itemDetailObj {
  font-size: 12px;
  padding: 10px 15px;
  color: var(--ex-default-font-color);
  line-height: 24px;
  word-wrap: break-word;
}
.itemDetailObj img {
  width: 100%;
}
</style>
