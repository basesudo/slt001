<template>
  <div class="search-form-box">
    <div class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    title: {
      type: String,
      default: "搜索栏",
    },
  },
  components: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.search-form-box {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  .title {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      display: block;
      height: 20px;
      width: 5px;
      background-color: #419efc;
      margin-right: 10px;
      border-radius: 8px;
    }
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
