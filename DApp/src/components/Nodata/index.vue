<template>
  <div class="noData">
    <svg-load name="noyet" class="noDatAimg"></svg-load>
    <div class="noName">{{ _t18(`no_data`) }}</div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
</script>
<style lang="scss" scoped>
.noData {
  padding: 50px 0 80px;
  text-align: center;
  .noDatAimg {
    font-size: 150px;
    // height: 180px;
  }
  .noName {
    margin-top: 10px;
    font-size: 14px;
    font-weight: normal;
    color: var(--ex-passive-font-color);
  }
}
</style>
