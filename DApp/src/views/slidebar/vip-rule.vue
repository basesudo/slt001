<template>
  <!-- 规则 -->
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar :currentName="`VIP`" :border_bottom="true"></HeaderBar>
    <!--内容-->
    <div class="itemDetailObj" v-html="currentHtml"></div>
    <Nodata v-if="!currentHtml"></Nodata>
  </div>
</template>
<script setup>
import { useMainStore } from '@/store/index'
import { _t18 } from '@/utils/public'
// const cuttentRight = { iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }] }
const currentHtml = ref(null)
const mainStore = useMainStore()
onMounted(() => {
  currentHtml.value = mainStore.getVIPRule[0].info
})
</script>
<style>
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
