<template>
  <div class="details">
    <div class="title ff-num">详情</div>
    <div class="list">
      <div class="item">
        <div class="left">分类</div>
        <div class="right">6c</div>
      </div>
      <div class="item">
        <div class="left">创作者</div>
        <div class="right">Anonymous-User-d5863</div>
      </div>
      <div class="item">
        <div class="left">所有者</div>
        <div class="right">Anonymous-User-d5863</div>
      </div>
      <div class="item">
        <div class="left">合约地址</div>
        <div class="right">0x532d…2df9</div>
      </div>
      <div class="item">
        <div class="left">代币ID</div>
        <div class="right">Anonymous-User-d5863</div>
      </div>
      <div class="item">
        <div class="left">版权费</div>
        <div class="right">Anonymous-User-d5863</div>
      </div>
      <div class="item">
        <div class="left">平台手续费</div>
        <div class="right">Anonymous-User-d5863</div>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.details {
  margin-top: 30px;
  .title {
    font-size: 16px;
    color: var(--ex-font-color6);
    font-weight: bold;
  }
  .list {
    margin-top: 10px;
    padding: 20px 10px 0;
    border: 1px solid var(--ex-border-color);
    border-radius: 5px 5px 5px 5px;
    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .left {
        font-size: 12px;
        color: var(--ex-passive-font-color);
      }
      .right {
        font-size: 12px;
        font-weight: bold;
        color: var(--ex-font-color6);
      }
    }
  }
}
</style>
