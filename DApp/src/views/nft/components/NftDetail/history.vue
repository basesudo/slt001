<!-- 交易历史 -->
<template>
  <div class="history">
    <div class="title ff-num">交易历史</div>
    <div class="bottom">
      <div class="top">
        <div class="flexItem">昵称</div>
        <div class="flexItem">操作</div>
        <div class="flexItem">交易价格</div>
        <div class="flexItem">上架时间</div>
      </div>
      <div class="footer">
        <div class="flexItem text-ellipsis">6H</div>
        <div class="flexItem ff-num">已购买</div>
        <div class="flexItem">1,05 USDT</div>
        <div class="flexItem">
          <div>2023-08-08</div>
          <div class="currentTime">15:31:29</div>
        </div>
      </div>
      <div class="footer">
        <div class="flexItem text-ellipsis">6H</div>
        <div class="flexItem ff-num">已购买</div>
        <div class="flexItem">1,05 USDT</div>
        <div class="flexItem">
          <div>2023-08-08</div>
          <div class="currentTime">15:31:29</div>
        </div>
      </div>
      <div class="footer">
        <div class="flexItem text-ellipsis">6H</div>
        <div class="flexItem ff-num">已购买</div>
        <div class="flexItem">1,05 USDT</div>
        <div class="flexItem">
          <div>2023-08-08</div>
          <div class="currentTime">15:31:29</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.history {
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
        text-align: center;
      }
      .flexItem:nth-child(4) {
        text-align: right;
      }
    }
    .footer {
      display: flex;
      padding: 20px 10px;
      align-items: center;
      .flexItem {
        flex: 1;
        font-size: 12px;
        font-weight: bold;
        color: var(--ex-font-color6);
      }
      .flexItem:nth-child(2) {
        text-align: center;
        color: var(--ex-passive-font-color);
        font-weight: normal;
      }
      .flexItem:nth-child(3) {
        text-align: center;
      }
      .flexItem:nth-child(4) {
        text-align: right;
        color: var(--ex-passive-font-color);
        .currentTime {
          margin-top: 3px;
        }
      }
    }
  }
}
</style>
