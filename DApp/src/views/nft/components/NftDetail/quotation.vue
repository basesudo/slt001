<!-- 报价 -->
<template>
  <div class="quotation">
    <div class="title ff-num">报价</div>
    <div class="bottom">
      <div class="top">
        <div class="flexItem">报价人</div>
        <div class="flexItem">截止期限</div>
        <div class="flexItem">报价</div>
      </div>
      <div class="footer">
        <div class="flexItem text-ellipsis">
          Ghour1dsdjasjdGhour1dsdjasjdasjkljGhour1dsdjasjdasjkljasjklj
        </div>
        <div class="flexItem">In 6 Days</div>
        <div class="flexItem">1,05 USDT</div>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.quotation {
  margin-top: 30px;
  font-size: 12px;
  .title {
    font-size: 16px;
    color: var(--ex-font-color6);
    font-weight: bold;
  }
  .bottom {
    margin-top: 10px;
    border-radius: 5px 5px 5px 5px;
    border: 1px solid var(--ex-border-color);
    .top {
      display: flex;
      padding: 15px 0;
      margin: 0 10px;
      border-bottom: 1px solid var(--ex-border-color);
      .flexItem {
        flex: 1;
      }
      .flexItem:nth-child(2) {
        text-align: center;
      }
      .flexItem:nth-child(3) {
        text-align: right;
      }
    }
    .footer {
      display: flex;
      padding: 20px 10px;
      .flexItem {
        flex: 1;
        font-size: 12px;
        font-weight: bold;
        color: var(--ex-font-color6);
      }
      .flexItem:nth-child(2) {
        text-align: center;
      }
      .flexItem:nth-child(3) {
        text-align: right;
      }
    }
  }
}
</style>
