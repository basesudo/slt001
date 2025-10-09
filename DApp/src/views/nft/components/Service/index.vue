<template>
  <div class="customer">
    <div class="service" @click="dispatchCustomEvent('event_serviceChange')">
      <svg-load name="kefuNft" class="serviceImg"></svg-load>
    </div>
  </div>
</template>
<script setup>
import { dispatchCustomEvent } from '@/utils'
</script>
<style lang="scss" scoped>
.customer {
  position: fixed;

  bottom: 92px;
  width: 100%;
  max-width: var(--ex-max-width);
  height: 40px;
  border-radius: 50%;
  .service {
    position: absolute;
    width: 40px;
    right: 15px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--ex-div-bgColor1);
    text-align: center;
    line-height: 40px;
    .serviceImg {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
