<script setup>
let props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div v-if="props.isLoading" id="app-loading">
    <div class="loading">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="text" v-if="prop.text">{{ prop.text }}</div>
  </div>
</template>
<style lang="scss" scoped>
#app-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color:var(--ex-default-background-color);
  z-index: 99;
  transition: opacity 0.3s;
}
.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  color: var(--ex-font-color28);
}

.loading > div {
  display: inline-block;
  float: none;
  background-color: var(--ex-rfd-rise);
  border: 0 solid var(--ex-border-color7);
}

.loading {
  width: 54px;
  height: 18px;
}

.loading > div:nth-child(1) {
  animation-delay: -200ms;
}

.loading > div:nth-child(2) {
  animation-delay: -100ms;
}

.loading > div:nth-child(3) {
  animation-delay: 0ms;
}

.loading > div {
  width: 10px;
  height: 10px;
  margin: 4px;
  border-radius: 100%;
  animation: ball-pulse 1s ease infinite;
}

.loading.la-sm {
  width: 26px;
  height: 8px;
}

.loading.la-sm > div {
  width: 4px;
  height: 4px;
  margin: 2px;
}

.loading.la-2x {
  width: 108px;
  height: 36px;
}

.loading.la-2x > div {
  width: 20px;
  height: 20px;
  margin: 8px;
}

.loading.la-3x {
  width: 162px;
  height: 54px;
}

.loading.la-3x > div {
  width: 30px;
  height: 30px;
  margin: 12px;
}

@keyframes ball-pulse {
  0%,
  60%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  30% {
    opacity: 0.1;
    transform: scale(0.01);
  }
}
</style>
