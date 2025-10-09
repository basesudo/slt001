<template>
  <div class="searchBtn">
    <svg-load name="lujing3047" class="searchLeft"></svg-load>
    <div class="searchInput" v-if="disabledInput">搜索商品</div>
    <input v-if="!disabledInput" type="text" placeholder="搜索商品" class="searchInput" v-model.trim="searchName"
      @input="searchBtn" />
  </div>
</template>
<script setup>
import { inject } from 'vue'
const props = defineProps({
  disabledInput: {
    type: Boolean,
    default: () => true
  }
})
const searchName = inject('searchName', '')
</script>
<style lang="scss" scoped>
.searchBtn {
  padding: 8px 22px;
  border-radius: 25px 25px 25px 25px;
  border: 1px solid var(--ex-border-color);
  display: flex;
  align-items: center;

  .searchLeft {
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }

  .searchInput {
    flex: 1;
    color: var(--ex-font-color12);
    font-size: 14px;
    background: var(--ex-default-background-color);
  }

  input::-webkit-input-placeholder {
    color: var(--ex-font-color12);
  }

  input::-moz-input-placeholder {
    color: var(--ex-font-color12);
  }

  input::-ms-input-placeholder {
    color: var(--ex-font-color12);
  }
}
</style>
