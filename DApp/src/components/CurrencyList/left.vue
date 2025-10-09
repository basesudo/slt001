<template>
  <div class="left">
    <!-- {{ data }} -->
    <!-- <svg-load v-if="showLeftImg" :name="data.icon" class="leftImg"></svg-load> -->
    <image-load :filePath="data.logo" v-if="showLeftImg" class="leftImg" />
    <div class="itemTitle">
      <div class="itemTitleTop">
        <div class="fw-bold">{{ data.showSymbol }}</div>
        <!-- <div class="typeName">/{{ data.baseCoinUpperCase }}</div> -->
      </div>
      <!-- <div class="itemTitleBot">
        <div>USDT</div>
        <div class="itemTitleBotNum ff-num">10x</div>
      </div> -->
    </div>
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
.left {
  flex: 1;
  display: flex;
  align-items: center;
  .leftImg {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  .itemTitle {
    font-size: 12px;
    color: #798cae;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .itemTitleTop {
      margin-bottom: 2px;
      font-size: 14px;
      color: var(--ex-default-font-color);
      display: flex;
      align-items: center;
      .typeName {
        color: var(--ex-passive-font-color);
        font-size: 12px;
      }
    }
    .itemTitleBot {
      margin-top: 2px;
      display: flex;
      align-items: center;
      .itemTitleBotNum {
        margin-left: 5px;
        padding: 3px;
        background: var(--ex-div-bgColor6);
        font-size: 12px;
        color: var(--ex-font-color2);
      }
    }
  }
}
</style>
