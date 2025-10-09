<!-- 头部 -->
<script setup>
import { useMainStore } from '@/store/index.js'
import { _t18 } from '@/utils/public'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  leftIcon: {
    type: String,
    default: 'back'
  },
  leftClickCallback: {
    type: String,
    default: ''
  }
})

onMounted(() => {
  console.log('onMounted')
})
const mainStore = useMainStore()
const router = useRouter()
/**
 * 切换语言
 */
const setLanguage = () => {
  mainStore.setLanguage('en')
}
/**
 * 左侧点击
 */
const leftClick = () => {
  // 存在定义回调函数
  if (props.leftClickCallback) {
    emit(props.leftClickCallback)
  } else {
    router.back()
  }
}
</script>

<template>
  <div class="nav-bar-box">
    <div class="nav-bar">
      <slot name="head"></slot>
      <div class="left" @click="leftClick">
        <svg-load v-if="leftIcon" :name="leftIcon" :platform="[]"></svg-load>
        <slot name="left"></slot>
      </div>
      <div class="center" v-if="props.title">
        {{ _t18(props.title) }}
        <slot name="center"></slot>
      </div>
      <div class="right">
        <!-- <div @click="setLanguage">切换语言</div> -->
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-bar-box {
  padding-top: constant(safe-area-inset-top); /* iOS 11.0 */
  // border-bottom: 1px solid var(--ex-border-color);

  .nav-bar {
    background-color: var(--ex-bgColor);
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    padding: 0 15px;

    .left {
      min-width: 120px;
      text-align: left;
      width: 100%;
    }
    .center {
      width: 100%;
      text-align: center;
      & + .right {
        width: 100%;
      }
    }
    .right {
      min-width: 100px;
      text-align: right;
    }
  }
}
</style>
