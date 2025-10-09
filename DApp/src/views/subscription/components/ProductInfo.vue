<template>
  <div>
    <p class="title fw-bold">
      <!-- 产品详情 -->
      {{ _t18('product_details') }}
    </p>
    <div class="info">
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Total_issuance') }}</div>
        <div class="infoData_tip_txt">{{ data.totalAmount }}</div>
      </div>
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Toke_ type') }}</div>
        <div class="infoData_tip_txt">ERC-20</div>
      </div>
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Private_placement_price') }}</div>
        <div class="infoData_tip_txt">{{ data.price }}</div>
      </div>
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Private_Placement_Volume') }}</div>
        <div class="infoData_tip_txt">{{ data.raisingAmount }}</div>
      </div>
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Private_placement') }}({{ _t18('day') }})</div>
        <div class="infoData_tip_txt">
          {{ (data.endTimes - data.beginTimes) / (60 * 60 * 24 * 1000) }}
        </div>
      </div>
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Private_Placement_Date') }}</div>
        <div class="infoData_tip_txt">{{ _timeFormat(data.beginTimes, 'MM/DD/YYYY', true) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _timeFormat } from '@/utils/public'
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
.title {
  font-size: 16px;
}
.info {
  margin-top: 10px;
  .infoData_tip {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .infoData_tip_tit {
      // color: #838b9c;
    }
  }
}
</style>
