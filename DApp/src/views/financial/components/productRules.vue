<template>
  <div class="rules">
    <!-- 产品规则 -->
    <div class="title fw-bold">{{ _t18('product_rules') }}</div>
    <!-- 暂无介绍 -->
    <div class="item">{{ proRules ? proRules : _t18(`No_introductionyet`) }}</div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  proRules: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.rules {
  padding: 20px 15px;
  border-top: 1px solid var(--ex-border-color);
  border-bottom: 1px solid var(--ex-border-color);
  .title {
    color: var(--ex-default-font-color);
    font-size: 16px;
    margin-bottom: 20px;
  }
  .item {
    font-size: 12px;
    color: var(--ex-passive-font-color);
    margin-bottom: 10px;
  }
  .tail {
    color: var(--ex-default-font-color);
    font-size: 12px;
  }
}
</style>
