<!-- 弹窗 -->
<script setup>
let props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  close: {
    type: Boolean,
    default: true
  },
  title: {
    type: String
  },
  content: {
    type: Object
  },
  direction: {
    type: String,
    default: 'center'
  }
})

let emit = defineEmits(['handelClose'])
const handelClose = () => {
  emit('handelClose', false)
}
</script>

<template>
  <div>
    <van-popup
      v-model:show="props.show"
      round
      :transition-appear="true"
      @click-overlay="handelClose"
      :position="direction"
    >
      <div class="popup">
        <!-- 标题 -->
        <p>{{ props.title }}</p>
        <!-- 关闭按钮 -->
        <svg-load class="closeSvg" name="guanbi" v-if="props.close" @click="handelClose"></svg-load>
        <!-- 内容 仅适用于规则/说明-->
        <div v-if="props.content">
          <div v-for="(item, index) in content" :key="index" class="popupContent">
            <div v-if="item.content" class="content1" v-html="item.content"></div>
          </div>
        </div>
        <slot name="content2"></slot>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  > * {
    font-size: 14px;
  }
  & > p {
    font-size: 18px;
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .closeSvg {
    font-size: 24px;
    position: absolute;
    top: 15px;
    right: 20px;
  }
  & > div {
    padding-top: 50px;
  }
  .popupContent {
    padding: 10px 15px;
    .title {
      font-size: 16px;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .content1 {
      font-size: 12px;
      padding: 10px 15px;
      color: var(--ex-default-font-color);
      line-height: 24px;
      word-wrap: break-word;
      & > div {
        p {
          display: flex;
          align-items: center;
          font-size: 14px;
          .square {
            font-size: 6px;
            margin-right: 5px;
          }
        }
        div {
          // text-indent: 2em;
         color: var(--ex-font-color8);
          line-height: 1.3;
          margin: 10px 0 10px;
        }
      }
    }
    .content2 {
      .note {
        margin-bottom: 5px;
        font-size: 12px;
        line-height: 1.5;
      }
    }
  }
}
:deep(.van-popup--bottom) {
  max-width: var(--ex-max-width);
  max-height: 80%;
  margin: auto;
  left: 0;
  right: 0;
}
:deep(.van-popup) {
  max-width: var(--ex-max-width);
}
</style>
