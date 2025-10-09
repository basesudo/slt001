<template>
  <div class="editLeft">
    <!-- <svg-load name="btc" class="leftImg"></svg-load> -->
    <image-load :filePath="data.logo" v-if="showLeftImg" class="leftImg" />
    <div class="leftNames">
      <div class="fw-bold">{{ data.showSymbol }}</div>

      <!-- <div class="fw-bold">{{ data.coinUpperCase }}</div>
      <div class="second">/{{ data.baseCoinUpperCase }}</div> -->
    </div>
    <!-- <div class="leftName ff-num">10x</div> -->
  </div>
</template>
<script setup>
const props = defineProps({
  showLeftImg: {
    type: Boolean,
    default: true
  },
  data: {
    type: Object,
    default: () => {}
  }
})
</script>
<style lang="scss" scoped>
.editLeft {
  flex: 1;
  display: flex;
  align-items: center;
  .leftImg {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
  .leftNames {
    display: flex;
    align-items: baseline;
    font-size: 14px;
    color: var(--ex-default-font-color);
    .second {
      color: var(--ex-passive-font-color);
      font-size: 12px;
    }
  }
  .leftName {
    margin-left: 5px;
    padding: 3px;
    font-size: 12px;
    color: var(--ex-font-color2);
    border-radius: 1px;
    background: var(--ex-div-bgColor6);
  }
}
</style>
