<template>
  <div class="price">
    <div class="title ff-num">{{ title }}</div>
    <div class="num fw-num">22 USDT &nbsp;<span class="right">≈ 22.00 USD</span></div>
    <slot name="footerPrice"></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  }
})
</script>
<style lang="scss" scoped>
.price {
  margin-top: 30px;
  .title {
    font-size: 12px;
    color: var(--ex-passive-font-color);
  }
  .num {
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: var(--ex-font-color6);
    .right {
      font-size: 14px;
      color: var(--ex-passive-font-color);
    }
  }
}
</style>
