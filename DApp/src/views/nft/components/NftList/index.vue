<template>
  <div class="item">
    <img class="itemImg" src="https://static.runoob.com/images/demo/demo2.jpg" alt="" />
    <div class="bottom">
      <div class="title">NEON CUTE <span class="ff-num">#345</span></div>
      <slot name="footerBottom"></slot>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
footer {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  .item {
    margin-bottom: 20px;
    width: 161px;
    border-radius: 3px;
    border: 1px solid var(--ex-border-color);
    .itemImg {
      width: 100%;
      height: 161px;
      object-fit: cover;
    }
    .bottom {
      padding: 15px 10px;
      .title {
        font-size: 14px;
        font-weight: 600;
        color: var(--ex-font-color6);
      }
      .bottomItem {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        .left {
          color: var(--ex-passive-font-color);
        }
        .right {
          font-weight: bold;
          color: var(--ex-font-color6);
        }
      }
    }
  }
}
</style>
