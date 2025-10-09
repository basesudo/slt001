<template>
  <div class="table-content-box">
    <div class="title" v-if="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  components: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.table-content-box {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
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
