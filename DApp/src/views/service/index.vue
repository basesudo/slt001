<template>
  <div class="service">
    <iframe v-if="link" :src="link" frameborder="0"></iframe>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const link = ref(route.query.url || '')
link.value = decodeURIComponent(link.value)
// location.href = link.value
</script>

<style lang="scss" scoped>
iframe {
  width: var(--ex-max-width);
  height: 100vh;
}
</style>
