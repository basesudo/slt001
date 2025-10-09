<!-- 复制 -->
<template>
  <div class="copy" @click="toCopy" :style="{ justifyContent: contentFix }">
    <slot name="copyMsg"></slot>
    <svg-load name="copy" class="img" :style="{ fontSize: fontSize }" v-if="noFlag"></svg-load>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import Copy from 'vue-clipboard3'
const props = defineProps({
  data: {
    type: [String, Number],
    default: ''
  },
  contentFix: {
    type: String,
    default: 'space-between'
  },
  fontSize: {
    type: String,
    default: '14px'
  },
  noFlag:{
    type: Boolean,
    default: true
  }
})
const { toClipboard } = Copy()
const toCopy = async () => {
  try {
    await toClipboard(`${props.data}`)
    _toast('copy_success')
  } catch (e) {
    _toast('copy_error')
  }
}
</script>

<style lang="scss" scoped>
.copy {
  padding: 5px 0;
  display: flex;
  // padding-right: 10px;
  .img {
    margin-left: 10px;
    // font-size: 14px;
  }
}
</style>
