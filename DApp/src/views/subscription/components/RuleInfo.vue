<template>
  <!-- 预约规则 -->
  <div>
    <p class="title fw-bold">{{ _t18('product_rules') }}</p>
    <div class="info">
      <span>{{ _t18('Reservation_limit') }}</span
      >{{ purchaseLimit || 0 }}
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  purchaseLimit: {
    type: Number
  }
})
</script>

<style lang="scss" scoped>
* {
  color: var(--ex-home-list-ftcolor2);
}
.title {
  font-size: 16px;
}
.info {
  margin-top: 20px;
  span {
    // color: #838b9c;
    margin-right: 20px;
  }
}
</style>
