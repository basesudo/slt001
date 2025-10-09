<!-- Tab切换组件 -->
<template>
  <van-tabs
    :active="props.active"
    @clickTab="change"
    title-inactive-color="#333"
    title-active-color="#17AC74"
    color="#17AC74"
    :line-width="lineWidth"
    :class="flexBetween ? 'betweenClass' : ''"
  >
    <van-tab v-for="(item, index) in props.tabList" :key="index" :title="item">
      <div class="tabContent">
        <slot name="tabContent"></slot>
      </div>
    </van-tab>
  </van-tabs>
</template>

<script setup>
const props = defineProps({
  tabList: {
    type: Array,
    default: []
  },
  active: {
    type: Number
  },
  lineWidth: {
    type: String,
    default: '16'
  },
  // 两端对齐
  flexBetween: {
    type: Boolean,
    default: false
  }
})

const active2 = ref(0)
const emit = defineEmits(['change'])
const change = (e) => {
  active2.value = e.name
}
watch(active2, (newValue) => {
  emit('change', active2.value)
})
</script>

<style lang="scss" scoped>
// :deep(.van-tabs__wrap) {
//   margin: 10px 0 15px;
// }
// :deep(.van-tabs__nav--line) {
//   padding-bottom: 8px;
// }
:deep(.van-tab--active) {
  font-weight: normal;
  color: var(--ex-home-list-ftcolor3) !important;
}
.tabContent {
  border-top: 1px solid var(--ex-border-color);
  p {
    color: var(--ex-passive-font-color);
    padding: 30px 0;
    text-align: center;
  }
}
.van-loading {
  text-align: center;
  padding: 30px;
}
.betweenClass {
  :deep(.van-tabs__nav) {
    background: var(--ex-home-list-bgcolor) !important ;
    .van-tab:first-child {
      justify-content: flex-start !important;
      margin-left: 15px;
    }
    .van-tab:nth-last-child(2) {
      justify-content: flex-end !important;
      margin-right: 15px;
    }
  }
}
</style>
