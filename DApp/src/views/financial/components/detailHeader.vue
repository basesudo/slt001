<template>
  <div class="header">
    <div v-if="!headerObj.icon" class="headerImg"></div>
    <image-load :filePath="headerObj.icon" v-if="headerObj.icon" class="itemImg" />
    <div class="fw-bold">{{ headerObj.title }}</div>
  </div>
  <div class="headerList">
    <div class="item">
      <div
        class="itemNum fw-num"
        :style="headerObj.leftColor ? `color: ${headerObj.leftColor}` : ''"
      >
        {{ headerObj.leftNum }}
      </div>
      <div class="itemName">{{ headerObj.leftName }}</div>
    </div>
    <div class="item">
      <div class="itemNum fw-num">{{ headerObj.centerNum }}</div>
      <div class="itemName">{{ headerObj.centerName }}</div>
    </div>
    <div class="item">
      <div class="itemNum fw-num">{{ headerObj.rightNum }}</div>
      <div class="itemName">{{ headerObj.rightName }}</div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  headerObj: {
    type: Object,
    default: {}
  }
})
</script>
<style lang="scss" scoped>
.header {
  padding: 20px 15px;
  font-size: 16px;
  color: var(--ex-default-font-color);
  display: flex;
  .headerImg {
    width: 50px;
    height: 50px;
    background: var(--ex-div-bgColor3);
    border-radius: 5px 5px 5px 5px;
    margin-right: 10px;
  }
  .itemImg {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px 5px 5px 5px;
    margin-right: 10px;
  }
}
.headerList {
  padding: 0 15px 20px;
  display: flex;
  .item {
    flex: 1;
    .itemNum {
      font-size: 16px;
      color: var(--ex-default-font-color);
    }
    .itemName {
      margin-top: 10px;
      font-size: 12px;
      color: var(--ex-passive-font-color);
    }
  }
  .item:nth-child(2) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .item:nth-child(3) {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
