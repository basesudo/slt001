<script setup>
import Download from './components/download/index.vue'
import rxceDownload from './components/download/rxce.vue'

// 切换组件
const currentComponent = computed(() => {
  if (['rxce'].includes(__config._APP_ENV)) {
    return rxceDownload
  } else {
    return Download
  }
})
</script>
<template>
  <component :is="currentComponent"></component>
</template>

<style lang="scss" scoped></style>
