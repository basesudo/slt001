<!-- 截止时间 -->
<template>
  <div class="deadline">
    <div class="title ff-num">截止时间</div>
    <div class="bottom">
      <div class="num ff-num">06</div>
      <div class="unit">天</div>
      <div class="num ff-num">22</div>
      <div class="unit">小时</div>
      <div class="num ff-num">06</div>
      <div class="unit">分</div>
      <div class="num ff-num">06</div>
      <div class="unit">秒</div>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.deadline {
  margin-top: 30px;
  .title {
    font-size: 12px;
    color: var(--ex-passive-font-color);
  }
  .bottom {
    margin-top: 12px;
    display: flex;
    align-items: center;
    .num {
      font-size: 20px;
      font-weight: bold;
      color: var(--ex-font-color6);
    }
    .unit {
      margin: 0 10px;
      font-size: 14px;
      color: var(--ex-passive-font-color);
    }
  }
}
</style>
