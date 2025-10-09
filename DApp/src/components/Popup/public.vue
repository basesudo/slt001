<template>
  <div>
    <van-popup
      :show="props.show"
      :round="props.round"
      :position="props.direction"
      @update:show="onUpdateShow"
      @click-overlay="handelClose"
      :style="{ height: props.height, width: props.width }"
    >
      <div class="popupHeader" v-if="props.showHeader">
        <slot name="titleCustomize"></slot>
        <svg-load class="closeSvg" name="guanbi" v-if="props.close" @click="handelClose"></svg-load>
      </div>
      <div class="popupContent" v-if="empty">
        <slot name="contentCustomize"></slot>
      </div>
      <!-- 没有padding -->
      <slot name="emptyContentCustomize" v-if="!empty"></slot>
    </van-popup>
  </div>
</template>
<script setup>
let props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // 默认展示header  默认true
  showHeader: {
    type: Boolean,
    default: true
  },
  // 默认圆角
  round: {
    type: Boolean,
    default: true
  },
  close: {
    type: Boolean,
    default: true
  },
  direction: {
    type: String,
    default: 'center'
  },
  height: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  },
  empty: {
    type: Boolean,
    default: true
  }
})
let emit = defineEmits(['handelClose', 'update:show'])
const handelClose = () => {
  emit('handelClose', false)
}
const onUpdateShow = (val) => {
  // 透传给父组件，避免直接修改只读的 props
  emit('update:show', val)
  if (!val) handelClose()
}
</script>
<style lang="scss" scoped>
.popupHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;
  width: 100%;
  border-bottom: 1px solid var(--ex-border-color);
  .closeSvg {
    width: 24px;
    height: 24px;
  }
}

.popupContent {
  padding: 20px 15px;
  box-sizing: border-box;
}
:deep(.van-popup--bottom) {
  max-width: var(--ex-max-width);
  margin: auto;
  left: 0;
  right: 0;
}
:deep(.van-popup) {
  max-width: var(--ex-max-width);
  background: var(--ex-default-background-color);
}
:deep(.van-popup--left) {
  left: auto;
}
</style>
