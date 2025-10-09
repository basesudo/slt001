<template>
  <div class="describe">
    <div class="title ff-num">描述</div>
    <div class="bottom">
      <div class="item">1024 x 1024 px.IMAGE(1.44MB)</div>
      <div class="item">Each of them is umique.</div>
    </div>
  </div>
</template>
<script></script>
<style lang="scss" scoped>
.describe {
  margin-top: 30px;
  .title {
    font-size: 16px;
    color: var(--ex-font-color6);
    font-weight: bold;
  }
  .bottom {
    margin-top: 10px;
    padding: 0 10px 20px;
    border-radius: 5px 5px 5px 5px;
    border: 1px solid var(--ex-border-color);
    .item {
      margin-top: 20px;
      font-weight: bold;
      color: var(--ex-font-color6);
      font-size: 12px;
    }
  }
}
</style>
