<template>
  <div class="itemHistory">
    <img src="https://static.runoob.com/images/demo/demo2.jpg" alt="" class="itemHistoryImg" />
    <div class="itemHistoryR">
      <div class="left">
        <div class="title">NEON CUTE <span class="ff-num">#345</span></div>
        <div class="car">
          <svg-load name="shoumai" class="carShop"></svg-load>
          <div>售卖</div>
        </div>
      </div>
      <div class="right left">
        <div class="title">1.06 USD</div>
        <div class="car">
          <div class="fw-num">2023.08.08 14:37</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script></script>
<style lang="scss" scoped>
.itemHistory {
  margin-bottom: 20px;
  display: flex;
  .itemHistoryImg {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 5px;
  }
  .itemHistoryR {
    margin-left: 10px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    .left {
      .title {
        margin-top: 2px;
        font-size: 14px;
        font-weight: 600;
        color: var(--ex-font-color6);
      }
      .car {
        margin-top: 7px;
        display: flex;
        align-items: center;
        font-size: 12px;
        color: var(--ex-passive-font-color);
        .carShop {
          width: 14px;
          height: 14px;
          margin-right: 5px;
        }
      }
    }
    .right {
      text-align: right;
      .car {
        font-weight: bold;
        margin-top: 10px;
      }
    }
  }
}
</style>
