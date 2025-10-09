<template>
  <div class="infoCoin">
    <div class="top">
      <image-load :filePath="data?.logo" class="coinImg" v-if="data?.logo" />
      <p class="fw-bold">{{ data.showSymbol }}</p>
    </div>
    <div class="bottom">
      <div class="tip1">
        <p>{{ _t18('selling_price') }}</p>
        <p class="fw-num">{{ data.price }}</p>
      </div>
      <div class="tip2">
        <p>
          <!-- 发行总量 -->
          {{ _t18('Total_issuance') }}
        </p>

        <p class="fw-num">{{ data.totalAmount }} {{ data.showSymbol }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  data: {
    type: Object
  }
})
</script>

<style lang="scss" scoped>
* {
  color: var(--ex-home-list-ftcolor2);
}
.infoCoin {
  padding: 0 15px 20px;
  .top {
    padding: 20px 0;
    display: flex;
    align-items: center;
    .coinImg {
      width: 45px;
      height: auto;
      margin-right: 10px;
    }
    p {
      font-size: 20px;
    }
  }
  .bottom {
    display: flex;
    .tip1,
    .tip2 {
      flex: 1;
      & > p:first-child {
        margin-bottom: 10px;
      }
      & > p:last-child {
        font-size: 18px;
      }
    }
  }
}
</style>
